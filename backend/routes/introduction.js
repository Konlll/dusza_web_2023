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
                    callback(null, file.filename + '-' + Date.now() + path.extname(file.originalname))
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

introRouter.post("/", upload.array("files"),async (req,res) => {
   const files = req.files;
    const document_files = [];
    const picture_files = [];
    files.forEach(file => 
        {
            const ext = file.originalname.split('.').pop().toLowerCase();
            if (["pdf","doc","txt", "docx"].includes(ext)) 
            {
                documents.push(file);
            }
            else if (["jpg", "png", "jpeg", "webp","svg"].includes(ext)) 
            {
                pictures.push(file);
            }
            else 
            {
                    res.status(500).send({status : "something went wrong during uploading"})
            }
        });
       const docs = document_files.map(doc => 
           ({
               introId : 1,
               name : doc.originalname,
               path : doc.path
           }));
       const pics = picture_files.map( pic => (
           {
           introId : 1,
           name : pic.originalname,
           path : pic. path
       }));
    const createdDocuments = await prisma.document.createMany( 
        {
            data: docs
        })
    const createdPictures = await prisma.picture.createMany(
        {
            data : pics
        });
    res.status(200).json({pictures : createdPictures, documents : createdDocuments});

});
