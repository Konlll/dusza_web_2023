import express from "express";
import prisma from "../db.js";
import { Authenticate } from "../authentication.js";

export const gameRouter = express.Router();

gameRouter.get("/", Authenticate(["STUDENT"]), async (req, res) => {
    const data = await prisma.user.findUnique({
        where: {
            id: req.user.id
        },
        include: {
            group: {
                include: {
                    competition: true
                }
            },
            results: true
        }
    });

    let error = null;
    if (!data.group) {
        error = "Jelenleg nem tartozol csoportba.";
    }
    else if (!data.group.competition) {
        error = "A csapatod nem vesz részt egy versenybe sem.";
    } else if (data.results.find(x => x.competitionId == data.group.competition.id)) {
        error = "Már kitöltötted ennek a versenynek a feladatait.";
    }

    return res.json(error ? { error: error } : {
        username: data.username,
        groupName: data.group.name,
        competitionName: data.group.competition.name,
        startDate: data.group.competition.startDate,
        endDate: data.group.competition.endDate
    });
})

const GetUserTasks = async (user) => {
    const teamMembers = await prisma.user.findMany({
        where: {
            groupId: user.groupId
        },
        orderBy: {
            id: "asc"
        },
        include: {
            group: {
                include: {
                    competition: {
                        include: {
                            tasks: true
                        }
                    }
                }
            }
        }
    })

    const userIndex = teamMembers.findIndex(x => x.id == user.id);

    const tasks = teamMembers[0].group.competition.tasks;
    const tasksPerUser = tasks.length / 3;

    const startIndex = tasksPerUser * userIndex;
    return tasks.slice(startIndex, startIndex + tasksPerUser);
}

const shuffle = (arr) => {
    var i = arr.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
};

gameRouter.get("/questions", Authenticate(["STUDENT"]), async (req, res) => {
    const tasks = await GetUserTasks(req.user);

    let scrambled = []
    for (const task of tasks) {
        let word = task.word4.toUpperCase().split("");
        shuffle(word);
        // TODO: extra ellenőrzések
        scrambled.push({
            id: task.id,
            hints: [task.word1, task.word2, task.word3],
            word: word.join(" ")
        });
    }

    return res.json(scrambled);
})

gameRouter.post("/submit", Authenticate(["STUDENT"]), async (req, res) => {
    if (req.body.answers == undefined || req.body.time == undefined) {
        return res.status(400).send("Missing fields");
    }

    const time = parseInt(req.body.time);
    if (isNaN(time)) {
        return res.status(400).send();
    }

    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        },
        include: {
            group: {
                include: {
                    competition: true
                }
            }
        }
    });
    const competitionId = user.group.competition.id;

    const tasks = await GetUserTasks(req.user);
    let correct = 0;
    for (const task of tasks) {
        const answer = req.body.answers.find(x => x.id == task.id) || null;
        if (task.word4.toLowerCase().trim() == answer.answer.toLowerCase().trim()) {
            correct++;
        }
    }

    try {
        const result = await prisma.result.create({
            data: {
                competitionId: competitionId,
                userId: req.user.id,
                score: correct,
                time: time
            }
        });
    } catch {
        return res.status(400).send();
    }

    return res.json({ minutes: Math.ceil(req.body.time / 60) });
})
