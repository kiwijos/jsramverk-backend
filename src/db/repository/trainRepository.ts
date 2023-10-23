import fetch from "node-fetch";

const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

// Cache announcements to prevent over-fetching
const delayedCache = new Map();
let changeid = "0";

const stationCache = new Map();

const codeCache = new Map();

const trainRepository = {
    getTrainStations: async () => {
        if (stationCache.has("stations")) {
            return {
                ok: true,
                data: stationCache.get("stations"),
                error: null
            };
        }

        const query = `
        <REQUEST>
            <LOGIN authenticationkey="d8625fb909f941dd855b6611ee172759" />
            <QUERY objecttype="TrainStation" schemaversion="1.4">
                <INCLUDE>AdvertisedLocationName</INCLUDE>
                <INCLUDE>Geometry</INCLUDE>
                <INCLUDE>LocationSignature</INCLUDE>
            </QUERY>
        </REQUEST>`;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                body: query,
                headers: { "Content-Type": "text/xml" }
            });
            const result = await response.json();

            // Replace the Geometry object with longitude and latitude
            const stations = result.RESPONSE.RESULT[0].TrainStation.map((station) => {
                const [longitude, latitude] = station.Geometry.WGS84.split("POINT ")[1]
                    .split("(")[1]
                    .split(")")[0]
                    .split(" ");

                return {
                    AdvertisedLocationName: station.AdvertisedLocationName,
                    Longitude: longitude,
                    Latitude: latitude,
                    LocationSignature: station.LocationSignature
                };
            });

            stationCache.set("stations", stations);

            return {
                ok: true,
                data: stations,
                error: null
            };
        } catch (err) {
            return {
                ok: false,
                data: null,
                error: err.message
            };
        }
    },
    getTrainDelays: async () => {
        const query = `
            <REQUEST>
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

            if (delayedCache.size === 0) {
                // Initially populate delayedCache with all announcements
                result.RESPONSE.RESULT[0].TrainAnnouncement.forEach((delay) => {
                    delayedCache.set(delay.ActivityId, delay);
                });
            } else if (result.RESPONSE.RESULT[0].TrainAnnouncement.length > 0) {
                // Add only new announcements and remove those that have been deleted (if any)
                result.RESPONSE.RESULT[0].TrainAnnouncement.forEach((delay) => {
                    if (delayedCache.has(delay.ActivityId)) {
                        if (delay?.Deleted === true) {
                            delayedCache.delete(delay.ActivityId);
                        }
                    } else {
                        delayedCache.set(delay.ActivityId, delay);
                    }
                });
            }

            return {
                ok: true,
                data: Array.from(delayedCache.values()),
                error: null
            };
        } catch (err) {
            return {
                ok: false,
                data: null,
                error: err.message
            };
        }
    },
    getTrainCodes: async () => {
        if (codeCache.has("codes")) {
            return {
                ok: true,
                data: codeCache.get("codes"),
                error: null
            };
        }

        const query = `
            <REQUEST>
                <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                <QUERY objecttype="ReasonCode" schemaversion="1">
                    <INCLUDE>Code</INCLUDE>
                    <INCLUDE>Level1Description</INCLUDE>
                    <INCLUDE>Level2Description</INCLUDE>
                    <INCLUDE>Level3Description</INCLUDE>
                </QUERY>
            </REQUEST>`;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                body: query,
                headers: { "Content-Type": "text/xml" }
            });

            const result = await response.json();

            codeCache.set("codes", result.RESPONSE.RESULT[0].ReasonCode);

            return {
                ok: true,
                data: result.RESPONSE.RESULT[0].ReasonCode,
                error: null
            };
        } catch (err) {
            console.error(`Error fetching codes: ${err}`);

            return {
                ok: false,
                data: null,
                error: err.Message
            };
        }
    }
};

export default trainRepository;
