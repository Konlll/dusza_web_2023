import express from "express";
import prisma from "../db.js";
import { Authenticate } from "../authentication.js";
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
        return res.status(404).send("Not found.");
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
        return res.status(400).send("Missing fields");
    }

    const grade = parseInt(req.body.grade);
    const startDate = new Date(Date.parse(req.body.startDate));
    const endDate = new Date(Date.parse(req.body.endDate));
    if (isNaN(grade) || isNaN(startDate) || isNaN(endDate) || endDate <= startDate) {
        return res.status(400).send();
    }

    let id;
    if (req.params.id == "new") {
        id = -1;
    } else {
        id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(404).send("Not found.");
        }

        const competition = await prisma.competition.findUnique({
            where: { id: id }
        });
        if (new Date() > competition.startDate) {
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
        return res.status(404).send("Not found.");
    }

    try {
        await prisma.competition.delete({
            where: {
                id: id
            },
        });
    } catch {
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
// Get all the results
competitionRouter.get("/results", Authenticate(["JUDGE"]), async (req, res) => {
    const results = await prisma.result.aggregate(
        {
            _sum:
            {
                score: true
            }
        })
        .findMany({
            include:
            {
                competition:
                {
                    select:
                    {
                        grade: true,
                        name: true,
                        groups: true,

                    }
                }

            },
            orderBy:
            {
                time: true,
                score: true
            },
        });
    res.status(200).json(results);
})
