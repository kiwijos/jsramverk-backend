import { Response, Request } from "express";
import User from "../db/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const auth = {
    login: async (req: Request, res: Response) => {
        // Check if username and password are set
        const username = req.body.username;
        const password = req.body.password;
        // Get user from database
        const user = await User.findOne({ username: username });
        // Check if user exists
        if (!user) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Username or password is wrong",
                    detail: "Username or password is wrong"
                }
            });
        }
        // Check if password is correct
        if (!bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Username or password is wrong",
                    detail: "Username or password is wrong"
                }
            });
        }
        // If everything is ok, send token to client
        const payload = { username: user.username, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({
            data: {
                type: "success",
                message: "User logged in",
                user: payload,
                token: token
            }
        });
    },
    register: async (req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const passwordHash = bcrypt.hashSync(password, 10);

        //Check if username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username: username }, { email: email }]
        });
        if (existingUser) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    source: "/register",
                    title: "Username or email already exists",
                    detail: "Username or email already exists"
                }
            });
        }
        // Use mongoose to save user. Check if email exists first.
        // If not, save user to database
        const newUser = new User({
            username: username,
            passwordHash: passwordHash,
            email: email
        });
        await newUser.save();
        res.json({
            data: {
                message: "User successfully registered."
            }
        });
    }
};

export default auth;
