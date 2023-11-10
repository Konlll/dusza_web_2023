import express from "express";
import primsa from "../db.js";
export const adminRouter = express.Router();



/**
 * Gets all users (teachers, students, juries)
 */
adminRouter.get("/", async (req,res) => {
    const rows = await primsa.user.findMany();
    res.status(200).json(rows);

});

adminRouter.get("user/:id", async (req,res) => 
    {
        const user = await primsa.user.findFirst(
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
adminRouter.put("user/:id", async (req,res) => 
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

adminRouter.delete("/user/:id", async (req,res) => 
    {
        const user = await primsa.user.delete({
            where: {
                id: req.params.id
            }
        });
       res.status(200).send(`Successfully deleted user with ID:  ${req.params.id}`);
    })
