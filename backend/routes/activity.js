import express from "express";
import prisma from "../db.js";
import { Authenticate } from "../authentication.js";

export const activityRouter = express.Router();

activityRouter.get("/", Authenticate(["ADMIN"]), async (req, res) => {
    const teachers = await prisma.user.findMany({
        where: {
            role: "TEACHER"
        }
    });

    let grades = await prisma.task.findMany({
        select: {
            grade: true
        },
        distinct: ["grade"],
        orderBy: {
            grade: "asc"
        }
    });
    grades = grades.map(x => x.grade)

    let teacherCounts = []

    for (const teacher of teachers) {
        const tasks = await prisma.task.groupBy({
            by: "grade",
            where: {
                teacherId: teacher.id
            },
            _count: true
        });

        const total = tasks.reduce((sum, current) => sum + current._count, 0);

        teacherCounts.push(
            {
                id: teacher.id,
                name: teacher.username,
                grades: tasks,
                total: total
            });
    }

    teacherCounts.sort((a, b) => a.total - b.total).reverse();

    res.json({ grades: grades, teachers: teacherCounts });
})
