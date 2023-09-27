import fetch from "node-fetch";
import EventSource from "eventsource";
import type TrainPosition from "../models/TrainPosition.model";
import type TrainPositions from "../models/TrainPositions.model";
import { Server } from "socket.io";

const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

async function fetchTrainPositions(io: Server): Promise<void> {
    const query = `<REQUEST>
      <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
      <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1" />
  </REQUEST>`;

    const trainPositions: TrainPositions = {};

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: query,
            headers: { "Content-Type": "text/xml" }
        });

        const result = await response.json();

        const sseurl = result?.RESPONSE?.RESULT[0]?.INFO?.SSEURL;

        if (!sseurl) {
            throw new Error("SSEURL missing from response.");
        }

        const eventSource = new EventSource(sseurl);

        eventSource.onopen = () => {
            console.log("Connection to server opened.");
        };

        io.on("connection", (socket) => {
            console.log("A user connected");

            eventSource.onmessage = (e) => {
                try {
                    const parsedData = JSON.parse(e.data);

                    if (parsedData) {
                        const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];

                        const matchCoords = /(\d*\.\d+|\d+),?/g;

                        const position = (changedPosition.Position.WGS84.match(matchCoords) || [])
                            .map((coord: string) => parseFloat(coord))
                            .reverse();

                        const trainObject: TrainPosition = {
                            trainnumber: changedPosition.Train.AdvertisedTrainNumber,
                            position: position,
                            timestamp: changedPosition.TimeStamp,
                            bearing: changedPosition.Bearing,
                            status: !changedPosition.Deleted,
                            speed: changedPosition.Speed
                        };

                        if (
                            Object.hasOwn(
                                trainPositions,
                                changedPosition.Train.AdvertisedTrainNumber
                            )
                        ) {
                            socket.emit("message", trainObject);
                        }

                        trainPositions[changedPosition.Train.AdvertisedTrainNumber] = trainObject;
                    }
                } catch (err) {
                    console.error(`Error parsing message: ${err}`);
                }

                return;
            };
        });

        eventSource.onerror = (err) => {
            console.error(`EventSource failed: ${err}`);
        };
    } catch (err) {
        console.error(`Error fetching train positions: ${err}`);
    }
}

export default fetchTrainPositions;
