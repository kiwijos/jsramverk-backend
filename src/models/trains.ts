import fetch from 'node-fetch';
import {Response as FetchResponse} from 'node-fetch';
import EventSource from 'eventsource';

async function fetchTrainPositions(io): Promise<void> {


    const query = `<REQUEST>
    <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
    <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1" />
</REQUEST>`

    const trainPositions = {};

    const response: FetchResponse = await fetch(
        'https://api.trafikinfo.trafikverket.se/v2/data.json', {
            method: "POST",
            body: query,
            headers: { 'Content-Type': 'text/xml' }
        }
    )
    const result = await response.json()
    const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL

    const eventSource = new EventSource(sseurl)

    eventSource.onopen = function() {
        console.log('Connection to server opened.')
    }

    io.on('connection', (socket: { emit: (arg0: string, arg1: { trainnumber: any; position: any; timestamp: any; bearing: any; status: boolean; speed: any; }) => void; }) => {
        console.log('a user connected')

        eventSource.onmessage = function (e: { data: string; }) {
            try {
                const parsedData = JSON.parse(e.data);

                if (parsedData) {
                    const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];


                    const matchCoords = /(\d*\.\d+|\d+),?/g

                    const position = changedPosition.Position.WGS84.match(matchCoords).map(((t: string)=>parseFloat(t))).reverse()

                    const trainObject = {
                        trainnumber: changedPosition.Train.AdvertisedTrainNumber,
                        position: position,
                        timestamp: changedPosition.TimeStamp,
                        bearing: changedPosition.Bearing,
                        status: !changedPosition.Deleted,
                        speed: changedPosition.Speed,
                    };

                    if (trainPositions.hasOwnProperty(changedPosition.Train.AdvertisedTrainNumber)) {
                        socket.emit('message', trainObject);
                    }

                    trainPositions[changedPosition.Train.AdvertisedTrainNumber] = trainObject;
                }
            } catch (e) {
                console.log(e)
            }

            return
        }
    })



    eventSource.onerror = function(e: any) {
        console.log('EventSource failed.')
    }
}

export default fetchTrainPositions;
