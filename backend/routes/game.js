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
            }
        }
    });

    let error = null;
    if (!data.group) {
        error = "Jelenleg nem tartozol csoportba.";
    }
    else if (!data.group.competition) {
        error = "A csapatod nem vesz részt egy versenybe sem.";
    }

    res.json(error ? { error: error } : {
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

    res.json(scrambled);
})

gameRouter.post("/submit", Authenticate(["STUDENT"]), async (req, res) => {
    console.log(req.body);
    res.json({ minutes: Math.ceil(req.body.time / 60) });
})
