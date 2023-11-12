import express from "express";
import prisma from "../db.js";
import { Authenticate } from "../authentication.js";
import { error_obj } from "../server.js";
export const competitionRouter = express.Router();

competitionRouter.use(express.json());

// get all competitions
competitionRouter.get("/", Authenticate(["JUDGE"]), async (req, res) => {
    const competitions = await prisma.competition.findMany();

    res.json(competitions);
});

// get competition by id
competitionRouter.get("/:id", Authenticate(["JUDGE"]), async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        error_obj = { err: 404 };
        return res.status(404).send("Not found.");
    }

    const competition = await prisma.competition.findUnique({
        where:
        {
            id: id
        },
        include: {
            tasks: true
        }
    })

    if (competition == null) {
        error_obj = { err: 404 };
        res.status(404).send("Not found.");
    }

    res.json(competition);
});

// Create or edit competition
competitionRouter.put("/:id", Authenticate(["JUDGE"]), async (req, res) => {
    if (req.body.name == undefined
        || req.body.description == undefined
        || req.body.grade == undefined
        || req.body.startDate == undefined
        || req.body.endDate == undefined) {
        error_obj = { err: 400 };
        return res.status(400).send("Missing fields");
    }

    const grade = parseInt(req.body.grade);
    const startDate = new Date(Date.parse(req.body.startDate));
    const endDate = new Date(Date.parse(req.body.endDate));
    if (isNaN(grade) || isNaN(startDate) || isNaN(endDate) || endDate <= startDate) {
        error_obj = { err: 400 };
        return res.status(400).send();
    }

    let id;
    if (req.params.id == "new") {
        id = -1;
    } else {
        id = parseInt(req.params.id);
        if (isNaN(id)) {
            error_obj = { err: 404 };
            return res.status(404).send("Not found.");
        }

        const competition = await prisma.competition.findUnique({
            where: { id: id }
        });
        if (new Date() > competition.startDate) {
            error_obj = { err: 403 };
            return res.status(403).send("Already started");
        }
    }

    const data = {
        name: req.body.name,
        description: req.body.description,
        grade: grade,
        startDate: startDate,
        endDate: endDate
    };

    var competition = await prisma.competition.upsert({
        where: {
            id: id
        },
        create: data,
        update: data
    });

    res.status(200).json(competition);

})

// Delete competition
competitionRouter.delete("/:id", Authenticate(["JUDGE"]), async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        error_obj = { err: 404 };
        return res.status(404).send("Not found.");
    }

    try {
        await prisma.competition.delete({
            where: {
                id: id
            },
        });
    } catch {
        error_obj = { err: 404 };
        return res.status(404).send("Not found.");
    }

    res.json({});
});

competitionRouter.post("/:id/tasks", Authenticate(["JUDGE"]), async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(404).send("Not found.");
    }

    if (req.body.tasks == undefined) {
        return res.status(400).send("Missing fields");
    }

    let tasks = [];
    for (const t of req.body.tasks) {
        tasks.push({ id: parseInt(t) });
    }

    await prisma.competition.update({
        where: {
            id: id
        },
        data: {
            tasks: {
                set: tasks
            }
        }
    });

    res.json({});
})


//RESULTS
// Get results
competitionRouter.get("/:id/results", Authenticate(["JUDGE"]), async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(404).send("Not found.");
    }

    const competition = await prisma.competition.findUnique({
        where: {
            id: id
        }
    });

    if (competition == null) {
        return res.status(404).send();
    }

    const groups = await prisma.group.findMany({
        where: {
            competitionId: id
        },
        include: {
            users: {
                include: {
                    results: true
                }
            }
        }
    });

    let groupResults = [];
    for (const group of groups) {
        let score = 0;
        let times = [];
        for (const user of group.users) {
            score += user.results.find(x => x.competitionId == id)?.score || 0;
            let time = user.results.find(x => x.competitionId == id)?.time
            if (time) {
                times.push(time);
            }
        }

        groupResults.push({
            id: group.id,
            name: group.name,
            score: score,
            time: times.length == 0 ? null : times.reduce((sum, current) => sum + current, 0) / times.length
        });
    }

    groupResults.sort((a, b) => {
        if (a.score > b.score) {
            return -1;
        }
        else if (b.score > a.score) {
            return 1;
        }
        else if (a.time == null && b.time == null) {
            return 0;
        }
        else if (b.time == null || a.time < b.time) {
            return -1;
        }
        return 1;
    });

    res.json({ competition: competition, results: groupResults });
})
