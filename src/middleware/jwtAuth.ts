import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtAuth = {
    checkToken: function (req: Request, res: Response, next: NextFunction) {
        const providedToken = req.headers["x-access-token"];
        console.log("Checking jwt token");
        jwt.verify(providedToken, process.env.JWT_SECRET, function (err) {
            if (err) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: req.path,
                        title: "Unauthorized",
                        detail: err.message
                    }
                });
            }
            next();
        });
    }
};

export default jwtAuth;
