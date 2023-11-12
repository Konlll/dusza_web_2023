import express from "express";
import { Authenticate, HashPassword } from "../authentication.js";
import prisma from "../db.js";
import { error_obj } from "../server.js";
export const adminRouter = express.Router();


/**
 * Get all groups.
 */
adminRouter.get("/groups", Authenticate(["ADMIN", "JUDGE"]), async (req, res) => {
    const groups = await prisma.group.findMany();

    res.json(groups);
})

/**
 * Get a specific group by id.
 */
adminRouter.get("/group/:id", Authenticate(["ADMIN"]), async (req, res) => {
    const group = await prisma.group.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    });

    if (group == null) {
        error_obj = { err: 404 };
        return res.status(404);
    }

    res.json(group);
})

/**
 * Create a group.
 */
adminRouter.post("/groups/", Authenticate(["ADMIN"]), async (req, res) => {
    const user = await prisma.group.create({
        data: {
            name: req.body.name,
            description: req.body.description,
            competitionId: null
        }
    });

    res.status(200).json(user);
})

/**
 * Delete a group.
 */
adminRouter.delete("/groups/:id", Authenticate(["ADMIN"]), async (req, res) => {
    const users = prisma.user.updateMany({
        where: {
            groupId: parseInt(req.params.id)
        },
        data: {
            groupId: null
        }
    });

    const group = await prisma.group.delete({
        where: {
            id: parseInt(req.params.id)
        }
    });

    if (group == null) {
        res.status(404).send("Requested group not found.");
    }

    res.status(200).json(group);
})

/**
 * Edit a group.
 */
adminRouter.put("/groups/:id", Authenticate(["ADMIN"]), async (req, res) => {
    const user = await prisma.group.update({
        where: {
            id: parseInt(req.params.id)
        },
        data:
        {
            name: req.body.name,
            description: req.body.description
        }
    });

    res.status(200).json(user);
})

/**
 * Assign a group to a competition.
 */
adminRouter.post("/groups/:id/assign", Authenticate(["JUDGE"]), async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(404).send("Not found.");
    }

    if (req.body.competition == undefined) {
        return res.status(400).send("Missing fields");
    }

    const competition = parseInt(req.body.competition);
    if (isNaN(competition)) {
        return res.status(400).send();
    }

    const group = await prisma.group.update({
        where: {
            id: id
        },
        data: {
            competitionId: competition
        }
    });

    if (group == null) {
        return res.status(404).send("Not found.");
    }

    res.json(group);
})

/**
 * Remove a group from a competition.
 */
adminRouter.post("/groups/:id/unassign", Authenticate(["JUDGE"]), async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(404).send("Not found.");
    }

    const group = await prisma.group.update({
        where: {
            id: id
        },
        data: {
            competitionId: null
        }
    })

    if (group == null) {
        return res.status(404).send("Not found.");
    }

    res.json(group);
})

/**
 * Get all users.
 */
adminRouter.get("/", Authenticate(["ADMIN"]), async (req, res) => {
    const rows = await prisma.user.findMany({
        include: {
            group: true
        }
    });

    res.json(rows);
});

/**
 * Edit a user.
 */
adminRouter.put("/:id", Authenticate(["ADMIN"]), async (req, res) => {
    let data = {
        username: req.body.username,
        role: req.body.role,
        grade: parseInt(req.body.grade) || null,
        class: req.body.class || null,
        groupId: parseInt(req.body.groupId)
    };
    if (req.body.password) {
        data.password = HashPassword(req.body.password);
    }
    const user = await prisma.user.update(
        {
            where: {
                id: parseInt(req.params.id)
            },
            data: data
        });

    if (!user) {
        error_obj = { err: 500 };
        return res.status(500).send("Internal server error");

    }
    res.status(200).json(user);
})

/**
 * Delete a user.
 */
adminRouter.delete("/:id", Authenticate(["ADMIN"]), async (req, res) => {
    const user = await prisma.user.delete({
        where: {
            id: parseInt(req.params.id)
        }
    });

    if (user == null) {
        error_obj = { err: 404 }
        return res.status(404).send("Requested user not found.");
    }

    res.status(200).json(user);
})
