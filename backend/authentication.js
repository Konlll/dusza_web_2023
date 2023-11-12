import { createHmac } from "crypto";
import prisma from "./db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
//import {error_obj } from "./server.js";
dotenv.config()
const secret = process.env.SECRET;

export function HashPassword(password) {
    return createHmac('sha256', secret).update(password).digest('hex');
}

export function GenerateToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, secret);
}

export const Authenticate = (roles) => {
    return (req, res, next) => {
        const secret = process.env.SECRET;
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, secret, async (err, payload) => {
                if (err) {
                    //error_obj.err = 403;
                    return res.sendStatus(403);
                }

                const user = await prisma.user.findUnique({
                    where: {
                        id: payload.id
                    },
                })

                if (user == null || !roles.includes(user.role)) {
                    //error_obj.err = 403;
                    return res.sendStatus(403);
                }

                req.user = user;
                next();
            });
        } else {
            //error_obj.err = 401;
            return res.sendStatus(401);
        }
    };
};
