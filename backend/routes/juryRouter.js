import express from "express";
import prisma from "../db.js";
import {Authenticate} from "../authentication.js";
export const juryRouter = express.Router();

juryRouter.use(express.json());

// get all competitions
juryRouter.get("/", Authenticate(["JUDGE"]) ,async (req, res) => 
{
   const rows = await prisma.competition.findMany();
   if(rows == null) 
    {
        res.status(404).send("error");
    }
    res.status(200).json(rows);
});

// get competition by id
juryRouter.get("/competition/:id", Authenticate(["JUDGE"]),async (req,res) => 
    {
        const competition = await prisma.competition.findFirst({
            where: 
            {
                id: parseInt(req.params.id)
            }
        })
        if(competition == null) 
        {
            res.status(404).send("Not found.");
        }
        res.status(200).json(competition);
    });

//change the competition
juryRouter.put("/competition/:id", Authenticate(["JUDGE"]), async (req,res) => 
    {
      const competition = await prisma.competition.update(
          {
              where: {
                  id: parseInt(req.params.id)
              },
              data : {
                  ...req.body
              }

          }) 
        //TODO: Rewrite this logic
        if(competition.startDate > Date.now()) 
        {
            res.status(403).send("Competition is already started, you cannot modify it.");
        }
        else {
            res.status(200).send();
        }

})

juryRouter.post("/competition",Authenticate(["JUDGE"]), async (req, res) => 
    {
        const new_competition =  await prisma.competition.create( 
            {
                data: {
                    ...req.body
                }
            });
        res.status(200).send("Successfully created competition").json(new_competition);

    })

juryRouter.delete("/competition/:id",Authenticate(["JUDGE"]), async (req,res) => 
    {
        const result = await prisma.competition.delete({
            where : {
                id: req.params.id
            }
        })
    });
