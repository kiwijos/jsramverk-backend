import fetch from "node-fetch";
import { Request, Response } from "express";
import ErrorResponse from "../models/ErrorResponse.model";

const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

const delayed = {
    getDelayedTrains: async function getDelayedTrains(
        req: Request,
        res: Response
    ): Promise<object | ErrorResponse> {
        const query = `<REQUEST>
                  <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                  <QUERY objecttype="TrainAnnouncement" orderby='AdvertisedTimeAtLocation' schemaversion="1.8">
                        <FILTER>
                        <AND>
                            <EQ name="ActivityType" value="Avgang" />
                            <GT name="EstimatedTimeAtLocation" value="$now" />
                            <AND>
                                <GT name='AdvertisedTimeAtLocation' value='$dateadd(-00:15:00)' />
                                <LT name='AdvertisedTimeAtLocation'                   value='$dateadd(02:00:00)' />
                            </AND>
                        </AND>
                        </FILTER>
                        <INCLUDE>ActivityId</INCLUDE>
                        <INCLUDE>ActivityType</INCLUDE>
                        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
                        <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
                        <INCLUDE>AdvertisedTrainIdent</INCLUDE>
                        <INCLUDE>OperationalTrainNumber</INCLUDE>
                        <INCLUDE>Canceled</INCLUDE>
                        <INCLUDE>FromLocation</INCLUDE>
                        <INCLUDE>ToLocation</INCLUDE>
                        <INCLUDE>LocationSignature</INCLUDE>
                        <INCLUDE>TimeAtLocation</INCLUDE>
                        <INCLUDE>TrainOwner</INCLUDE>
                  </QUERY>
            </REQUEST>`;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                body: query,
                headers: { "Content-Type": "text/xml" }
            });

            const result = await response.json();

            return res.json({
                data: result.RESPONSE.RESULT[0].TrainAnnouncement
            });
        } catch (err) {
            console.error(`Error fetching delayed trains: ${err}`);

            res.status(500).json({
                errors: {
                    status: 500,
                    source: API_URL,
                    title: "Server Error",
                    detail: err.message
                }
            });
        }
    }
};

export default delayed;
