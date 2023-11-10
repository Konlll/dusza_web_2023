import express from "express";
import prisma from "../db.js";
import { Authenticate } from "../authentication.js";

export const tasksRouter = express.Router();

// Get all tasks
tasksRouter.get("/", Authenticate(["TEACHER"]), async (req, res) => {
    const tasks = await prisma.task.findMany();

    res.json(tasks);
})

// Get a single task
tasksRouter.get("/:id", Authenticate(["TEACHER"]), async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(404).send("Not found.");
    }

    const task = await prisma.task.findUnique({
        where: {
            id: id
        },
    });

    if (task == null) {
        return res.status(404).send("Not found.");
    }

    res.json(task);
})

// Upload file
tasksRouter.post("/upload", Authenticate(["TEACHER"]), async (req, res) => {
    const lines = req.body.text.split('\n');

    let data = [];
    let errors = [];

    for (const line of lines) {
        const fields = line.split(' ');

        if (fields.length != 5) {
            errors.push({ "line": line, "error": "Nem 4 szót tartalmaz a sor!" })
            continue;
        }

        const grade = parseInt(fields[4])
        if (isNaN(grade) || grade < 5 || grade > 8) {
            errors.push({ "line": line, "error": "A sor végén nem 5 és 8 közé eső szám van!" })
            continue;
        }

        const syllables = ((fields[3]).match(/[aáeéiíoóöőuúüű]/gi) || []).length;
        if (syllables < 3) {
            errors.push({ "line": line, "error": "A negyedik szó legalább 3 szótagos kell legyen!" })
            continue;
        }

        data.push({ "word1": fields[0], "word2": fields[1], "word3": fields[2], "word4": fields[3], "grade": grade, "teacherId": req.user.id });
    }

    let success = 0;
    if (data.length != 0) {
        const result = await prisma.task.createMany({ data: data, skipDuplicates: true });
        success = result.count;
    }

    return res.json({ "errors": errors, "success": success });
})

// Delete a task
tasksRouter.delete("/:id", Authenticate(["TEACHER"]), async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(404).send("Not found.");
    }

    try {
        await prisma.task.delete({
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

// Edit a task
tasksRouter.put("/:id", Authenticate(["TEACHER"]), async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(404).send("Not found.");
    }

    if (req.body.word1 == undefined
        || req.body.word2 == undefined
        || req.body.word3 == undefined
        || req.body.word4 == undefined
        || req.body.grade == undefined) {
        return res.status(400).send("Missing fields");
    }

    const grade = parseInt(req.body.grade);
    if (isNaN(grade)) {
        return res.status(400).send();
    }

    try {
        var task = await prisma.task.update({
            where: {
                id: id
            },
            data: {
                word1: req.body.word1,
                word2: req.body.word2,
                word3: req.body.word3,
                word4: req.body.word4,
                grade: req.body.grade
            }
        });
    }
    catch {
        return res.status(400).send();
    }

    res.json(task);
})
