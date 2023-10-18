import fetch from "node-fetch";
import { Request, Response } from "express";

const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

// Cache announcements to prevent over-fetching
const cache = new Map();

// Id to keep track of fetched announcements
let changeid = "0";

const delayed = {
    getDelayedTrains: async function getDelayedTrains(req: Request, res: Response): Promise<void> {
        const query = `<REQUEST>
                  <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                  <QUERY objecttype="TrainAnnouncement" orderby='AdvertisedTimeAtLocation' schemaversion="1.8"
                    includedeletedobjects="true"
                    changeid="${changeid}">
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

            // Update id to only fetch newer entries
            changeid = result.RESPONSE.RESULT[0].INFO.LASTCHANGEID;

            if (cache.size === 0) {
                // Initially populate cache with all announcements
                result.RESPONSE.RESULT[0].TrainAnnouncement.forEach((delay) => {
                    cache.set(delay.ActivityId, delay);
                });
            } else if (result.RESPONSE.RESULT[0].TrainAnnouncement.length > 0) {
                // Add only new announcements and remove those that have been deleted (if any)
                result.RESPONSE.RESULT[0].TrainAnnouncement.forEach((delay) => {
                    if (cache.has(delay.ActivityId)) {
                        if (delay?.Deleted === true) {
                            cache.delete(delay.ActivityId);
                        }
                    } else {
                        cache.set(delay.ActivityId, delay);
                    }
                });
            }

            res.json({ data: Array.from(cache.values()) });
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
