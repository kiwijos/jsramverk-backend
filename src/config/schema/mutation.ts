import ticketRepository from "../../db/repository/ticketRepository";
import userRepository from "../../db/repository/userRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type ITicket from "../../models/ITicket.model";

const mutation = {
    createTicket: async ({ code, trainnumber, traindate }: ITicket) => {
        const ticket = ticketRepository.createTicket({ code, trainnumber, traindate });
        return {
            data: ticket,
            ok: true,
            error: ""
        };
    },

    updateTicket: async ({ id, code, trainnumber, traindate }: ITicket & { id: string }) => {
        try {
            const ticket = await ticketRepository.updateTicket(id, {
                code,
                trainnumber,
                traindate
            });
            if (!ticket) {
                return {
                    data: null,
                    ok: false,
                    error: "Ticket not found"
                };
            }
            return {
                data: ticket,
                ok: true,
                error: ""
            };
        } catch (err) {
            return {
                data: null,
                ok: false,
                error: err.message
            };
        }
    },

    deleteTicket: async ({ id }: { id: string }) => {
        try {
            const ticket = await ticketRepository.deleteTicket(id);
            if (!ticket) {
                return {
                    data: null,
                    ok: false,
                    error: "Ticket not found"
                };
            }
            return {
                data: ticket,
                ok: true,
                error: ""
            };
        } catch (err) {
            return {
                data: null,
                ok: false,
                error: err.message
            };
        }
    },

    login: async ({ username, password }: { username: string; password: string }) => {
        const user = await userRepository.getUserByUsername(username);
        if (!user) {
            return {
                data: null,
                ok: false,
                error: "Username or password is wrong"
            };
        }
        if (!bcrypt.compareSync(password, user.passwordHash)) {
            return {
                data: null,
                ok: false,
                error: "Username or password is wrong"
            };
        }
        const payload = { username: user.username, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        return {
            data: {
                type: "success",
                message: "User logged in",
                user: payload,
                token: token
            },
            ok: true,
            error: ""
        };
    },

    register: async ({
        username,
        password,
        email
    }: {
        username: string;
        password: string;
        email: string;
    }) => {
        const existingUser = await userRepository.getUserByUsernameOrEmail(username, email);
        if (existingUser) {
            return {
                data: null,
                ok: false,
                error: "Username or email already exists"
            };
        }
        const user = await userRepository.createUser({ username, password, email });
        if (!user) {
            return {
                data: null,
                ok: false,
                error: "Error creating user"
            };
        }
        return {
            data: "User registered successfully",
            ok: true,
            error: ""
        };
    }
};

export default mutation;
