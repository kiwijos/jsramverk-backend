import fetch from "node-fetch";
import { Response, Request } from "express";

const codes = {
    getCodes: async function getCodes(req: Request, res: Response): Promise<void> {
        const query = `<REQUEST>
                  <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                  <QUERY objecttype="ReasonCode" schemaversion="1">
                        <INCLUDE>Code</INCLUDE>
                        <INCLUDE>Level1Description</INCLUDE>
                        <INCLUDE>Level2Description</INCLUDE>
                        <INCLUDE>Level3Description</INCLUDE>
                  </QUERY>
            </REQUEST>`;

        const response = fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
            method: "POST",
            body: query,
            headers: { "Content-Type": "text/xml" }
        })
            .then(function (response: { json: () => any }) {
                return response.json();
            })
            .then(function (result: { RESPONSE: { RESULT: { ReasonCode: any }[] } }) {
                return res.json({
                    data: result.RESPONSE.RESULT[0].ReasonCode
                });
            });
    }
};

export default codes;
