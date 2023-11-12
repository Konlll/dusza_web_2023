import express from "express";
import { Authenticate, GenerateToken, HashPassword } from "../authentication.js";
import prisma from "../db.js";
import { error_obj } from "../server.js";
export const authRouter = express.Router();

authRouter.use(express.json())

/**
 * Log in.
 */
authRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (username == undefined || password == undefined) {
        error_obj.err = 400;
        return res.status(400);
    }
    const passwordHash = HashPassword(req.body.password)

    const user = await prisma.user.findFirst({
        where: {
            AND: [
                { username: username },
                { password: passwordHash }
            ]
        },
    })

    if (user != null) {
        const token = GenerateToken(user);
        res.json(token);

    } else {
        error_obj.err = 401;
        return res.status(401).send({ err: "Incorrect password or username" });
    }
})

/**
 * Register a new user.
 */
authRouter.post("/register", Authenticate(["ADMIN"]), async (req, res) => {
    const { username, password, role } = req.body;
    if (username == undefined || password == undefined || role == undefined) {
        error_obj.err = 400;
        return res.status(400).send();
    }

    const passwordHash = HashPassword(password)

    const user = await prisma.user.create({
        data: {
            username: req.body.username,
            password: passwordHash,
            role: req.body.role,
            grade: req.body.grade || null,
            class: req.body.class || null
        }
    });
    res.status(200).json({ message: `successfully created user with there params: ${username}, ${password}, ${role}` });
});
