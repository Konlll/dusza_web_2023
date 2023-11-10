import { createHmac } from "crypto";
import prisma from "./db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
const secret = process.env.SECRET;

export function HashPassword(password) {
    console.log(`${secret}\n`)
    return createHmac('sha256', secret).update(password).digest('hex');
}

export function GenerateToken(id) {
    return jwt.sign({ id: id }, secret);
}

export const Authenticate = (roles) => {
    return (req, res, next) => {
        const secret = process.env.SECRET;
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, secret, async (err, payload) => {
                if (err) {
                    return res.sendStatus(403);
                }

                const user = await prisma.user.findUnique({
                    where: {
                        id: payload.id
                    },
                })

                if (user == null || !roles.includes(user.role)) {
                    return res.sendStatus(403);
                }

                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }
    };
};
