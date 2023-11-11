import express from "express";
import prisma from "../db.js";
import { Authenticate } from "../authentication.js";
export const adminRouter = express.Router();



/**
 * Gets all users (teachers, students, juries)
 */
adminRouter.get("/", Authenticate(["ADMIN"]),async (req,res) => {
    const rows = await prisma.user.findMany();
    res.status(200).json(rows);

});

adminRouter.get("/:id", Authenticate(["ADMIN"]),async (req,res) => 
    {
        const user = await prisma.user.findFirst(
            {
                where: 
                {
                    id: req.params.id
                }
            });
        if(user == null) 
        {
            res.status(404).send("Requested user not found.");
        }
                res.status(200).json(user);
    })
adminRouter.get("group/:id", Authenticate(["ADMIN"]), async (req, res) => 
    {
        const group = await prisma.group.findFirst(
            {
                where: 
                {
                    id: req.params.id
                }
            });
        res.status(200).json(group);
    })
adminRouter.get("/groups", Authenticate(["ADMIN"]), async (req,res) => 
    {
        const groups = await prisma.group.findMany();
        return groups;
    })
adminRouter.put("/:id", Authenticate(["ADMIN"]),async (req,res) => 
    {
            const user = prisma.user.update( 
                {
                    where: 
                    {
                        id: req.params.id
                    },
                    data: 
                    {
                        ...req.body
                    }
                });
       res.status(200).send(`Successfully updated user with ID:  ${req.params.id}`).json(user);
    })



adminRouter.post("/:id", Authenticate(["ADMIN"]),async (req,res) => 
    {
            const user = prisma.user.update( 
                {
                    where: 
                    {
                        id: req.params.id
                    },
                    data: 
                    {
                        ...req.body
                    }
                });
       res.status(200).send(`Successfully created user with ID:  ${req.params.id}`).json(user);
    })



adminRouter.delete("/:id", Authenticate(["ADMIN"]),async (req,res) => 
    {
        const user = await prisma.user.delete({
            where: {
                id: req.params.id
            }
        });
       res.status(200).send(`Successfully deleted user with ID:  ${req.params.id}`);
    })
