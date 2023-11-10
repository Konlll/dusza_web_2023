import express from "express";
import prisma from "../db.js";
import { HashPassword, GenerateToken } from "../authentication.js";

export const authRouter = express.Router();
/* 
 * TODO: sessionon való döntés
 * TODO: logout implementálása
 */
authRouter.post("/login", async (req, res) => {
    if (req.body.username == undefined || req.body.password == undefined) {
        return res.status(400).send();
    }

    const passwordHash = HashPassword(req.body.password)

    const user = await prisma.user.findFirst({
        where: {
            AND: [
                { username: req.body.username },
                { password: passwordHash }
            ]
        },
    })

    if (user != null) {
        const token = GenerateToken(user.id);
        res.json({ token });
    } else {
        return res.status(401).send("Incorrect password or username");
    }
})

authRouter.post("/register", async (req, res) => {
    if (req.body.username == undefined || req.body.password == undefined || req.body.role == undefined) {
        return res.status(400).send();
    }

    const passwordHash = HashPassword(req.body.password)

    const user = await prisma.user.create({
        data: {
            username: req.body.username,
            password: passwordHash,
            role: req.body.role
        }
    });

    const token = GenerateToken(user.id);
    res.json({ token });

});

authRouter.post("/logout", (req,res) => 
    {
        //TODO: clear the token and the session
    })
