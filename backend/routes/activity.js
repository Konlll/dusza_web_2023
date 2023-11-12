import express from "express";
import { Authenticate } from "../authentication.js";
import prisma from "../db.js";

export const activityRouter = express.Router();

/**
 * Aggregates data about teacher activity.
 */
activityRouter.get("/", Authenticate(["ADMIN"]), async (req, res) => {
    const teachers = await prisma.user.findMany({
        where: {
            role: "TEACHER"
        }
    });

    // Get all possible grades.
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

    // Count how many tasks a teacher created, broken down by grade.
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

    // Sort teachers by their total tasks created.
    teacherCounts.sort((a, b) => a.total - b.total).reverse();

    res.json({ grades: grades, teachers: teacherCounts });
})
