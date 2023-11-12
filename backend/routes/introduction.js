import express from "express";
import prisma from "../db.js"
import multer from "multer";
import path from "path";
export const introRouter = express.Router();
const storage = multer.diskStorage(
    {
        destination : (req,file,callback) => 
        {
            callback(null,'uploads/')
        },
        filename: (req, file, callback) => 
        {
                    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    })
const upload = multer({storage : storage});
introRouter.get("/", async (req,res) => 
    {
        const introduction_details = await prisma.intro.findFirst();
        if (introduction_details == null) 
        {
            return res.status(404);
        }
        return res.status(200).json(introduction_details);
    });
introRouter.put("/update",upload.array("files",2) ,async (req,res) => 
    {
        const files = req.files;
        const document_files = [];
        const image_files = [];
        console.log(req.body.files);
        console.log(req.files);
        if(files.length === 0) 
        {
            return res.status(500).send({err : "Something went wrong during the upload"})
        }
        files.forEach(file => 
            {
                let extension = file.originalname.split('.').pop().toLowerCase();
                if(["png","jpg","jpeg","webp"].includes(extension)) 
                {
                    image_files.push(file);
                }
                else if(["doc","docx","pdf"].includes(extension)) 
                {
                    document_files.push(file);
                }
            });
        const doc_objects = document_files.map(file => (
            {
                introId: 1,
                name: file.originalname,
                path : file.path
            }));
        const img_objects = image_files.map(file => 
            ({
                introId : 1,
                name: file.originalname,
                path : file.path
            }));
        const updated_intro = await prisma.intro.update(
            {
                data: 
                {
                    text : req.body.text,
                    documents : {
                        update : doc_objects
                    },
                    pictures:
                    {
                        update : img_objects
                    }
                }
            });
        if(updated_intro == null) 
        {
            return res.status(500).json({error : "Internal Server Error"});
        }
        res.status(200).json({success : "Successfully updated introduction page." });
})



introRouter.post("/create", upload.array("files",2), (req,res) => {

    const files = req.files;
    const document_files = [];
    const image_files = [];
    console.log(req.body.files);
    console.log(req.files);
    if(files.length === 0) 
    {
        return res.status(500).send({err : "Something went wrong during the upload"})
    }
    files.forEach(file => 
        {
            let extension = file.originalname.split('.').pop().toLowerCase();
            if(["png","jpg","jpeg","webp"].includes(extension)) 
            {
                image_files.push(file);
            }
            else if(["doc","docx","pdf"].includes(extension)) 
            {
                document_files.push(file);
            }
        });
    const doc_objects = document_files.map(file => (
        {
            introId: 1,
            name: file.originalname,
            path : file.path
        }));
    const img_objects = image_files.map(file => 
        ({
            introId : 1,
            name: file.originalname,
            path : file.path
        }));
    const intro_record =  prisma.intro.create( 
        {
            data: 
            {
                text : req.body.text,
                documents: 
                {
                    create : doc_objects
                },
                pictures: 
                {
                    create : img_objects
                }
            }
        })
    res.status(200).json({status : "Successfully uploaded files"});

});
/*
introRouter.post("/file", upload.single("file"), (req, res) => 
    {
        return res.json({file : req.file});
    })
*/
