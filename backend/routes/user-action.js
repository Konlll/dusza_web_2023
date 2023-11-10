import express from 'express'
import prisma from '../db.js'

export const userActionRouter = express.Router();


// Update a user
userActionRouter.put('/edit/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        return res.status(404).send("Not found.");
    }

    try {
        var user = await prisma.user.update({
            where: {
                id
            },
            data: {
                username: req.body.username,
                role: req.body.role,
                grade: req.body.grade,
                class: req.body.class, // Kérdéses hogy szükség van-e rá
                groupId: req.body.groupId
            }
        })
    } catch {
        return res.status(400).send()
    }

    res.status(200).json(user)
})


// Delete a user
userActionRouter.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(404).send("Not found.");
    }

    try {
        await prisma.user.delete({
            where: {
                id: id
            },
        });
    }
    catch {
        return res.status(404).send("Not found.");
    }

    res.send();
})
