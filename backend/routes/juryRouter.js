import express from "express";
import prisma from "../db.js";

export const juryRouter = express.Router();

juryRouter.use(express.json());

// get all competitions
juryRouter.get("/", async (req, res) => 
{
   const rows = await prisma.competition.findMany();
   if(rows == null) 
    {
        res.status(404).send("error");
    }
    res.status(200).json(rows);
});

// get competition by id
juryRouter.get("/competition/:id", async (req,res) => 
    {
        const competition = await prisma.competition.findFirst({
            where: 
            {
                id: parseInt(req.params.id)
            }
        })
        if(competition === null) 
        {
            res.status(404).json({err: "Can't find competition"});
        }
        res.status(200).json(competition);
    });

//change the competition
juryRouter.put("/competition/:id", async (req,res) => 
    {
        const {name,description,grade,startDate,endDate,groups,tasks,results} = req.body;
      const competition = await prisma.competition.update(
          {
              where: {
                  id: parseInt(req.params.id)
              },
              data : {
                   name: name,
                  description: description,
                  grade: grade,
                  startDate: startDate,
                  endDate: endDate,
                  groups: groups,
                  tasks: tasks,
                  results: results
              }
          }) 
        if(competition.startDate > Date.now()) 
        {
            res.status(403).send();
        }
        else {
            res.status(200).send();
        }

})

juryRouter.delete("/competition/:id", async (req,res) => 
    {
        await prisma.competition.delete({
            where : {
                id: req.params.id
            }
        })
    });
