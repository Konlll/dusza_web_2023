import express from "express";
import prisma from "../db.js";
import { HashPassword, GenerateToken } from "../authentication.js";

export const authRouter = express.Router();
/* 
 * TODO: sessionon való döntés
 * TODO: logout implementálása
 */
authRouter.use(express.json())
authRouter.post("/login", async (req, res) => {
    const {username, password} = req.body;
    if (username == undefined || password == undefined) {
        return res.status(400).send();
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
        const token = GenerateToken(user.id);
        res.json( token );
    } else {
        return res.status(401).send({err: "Incorrect password or username"});
    }
})

authRouter.post("/register", async (req, res) => {
    const {username, password, role} = req.body;
    if (username == undefined || password == undefined || role == undefined) {
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

    /*
    const token = GenerateToken(user.id);
    res.json({ token });
    */
 res.status(200).json({message: `successfully created user with there params: ${username}, ${password}, ${role}`});
});

authRouter.post("/logout", (req,res) => 
    {
        //TODO: implement the ability to log out
    })
