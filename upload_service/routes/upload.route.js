import express from "express";

import multer from "multer";
import { completeUpload, initializeUpload, uploadChunk, uploadToDB ,deleteFromDb} from "../controllers/multipartUpload.controller.js";

const upload = multer();

const router = express.Router();

router.post('/initialize' , upload.none() , initializeUpload);

router.post('/' , upload.single('chunk') , uploadChunk);

router.post('/complete', upload.none() , completeUpload);

router.post('/uploadToDb' , uploadToDB);
//implment delete 
//router.post('/deleteFromDb' , deleteFromDb);

export default router;