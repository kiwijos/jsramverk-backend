import fetch from "node-fetch";
import { Response, Request } from "express";
import ErrorResponse from "../models/ErrorResponse.model";

const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

const codes = {
    getCodes: async function getCodes(req: Request, res: Response): Promise<object | ErrorResponse> {
        const query = `<REQUEST>
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
            
            return res.json({
                data: result.RESPONSE.RESULT[0].ReasonCode
            });
        } catch (err) {
            console.error(`Error fetching codes: ${err}`);

            res.status(500).json({
                errors: {
                    status: 500,
                    source: API_URL,
                    title: 'Server Error',
                    message: err.message
                }
            });
        }
    }
};

export default codes;
