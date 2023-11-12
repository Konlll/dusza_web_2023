import { createHmac } from "crypto";
import prisma from "./db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
const secret = process.env.SECRET;

/**
 * Hashes the password for storing in the database.
 * @param {String} password 
 * @returns 
 */
export function HashPassword(password) {
    return createHmac('sha256', secret).update(password).digest('hex');
}

/**
 * Sign a jwt token so the user can log in.
 * @param {object} user 
 * @returns 
 */
export function GenerateToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, secret);
}

/**
 * Protects endpoints from unauthorized access.
 * @param {String[]} roles List of roles that should have access to this endpoint.
 * @returns 
 */
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
            return res.sendStatus(401);
        }
    };
};
