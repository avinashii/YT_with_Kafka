import AWS from 'aws-sdk';

import { addVideoDetialsToDB ,deleteVideoFromDB} from '../db/db.js';
import { pushVideoForEncodingToKafka } from './kafkapublisher.controller.js';

export const initializeUpload = async (req, res )=>{
    try {
        console.log('Intialising Upload');
        const {filename} = req.body;
       

        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        console.log('Filename:', filename);

        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'ap-south-1'
        });

        const bucketName = process.env.AWS_BUCKET;

        const createParams = {
            Bucket: bucketName,
            Key: filename,
            ContentType: 'video/mp4',
        };

        const multipartParams = await s3.createMultipartUpload(createParams).promise();
        console.log(multipartParams);
        const uploadId = multipartParams.UploadId;

        res.status(200).json( { uploadId });

    } catch (err) {
        console.log('Error initializing upload: ' , err);
        res.status(500).send(' Upload initialization failed');
    }
};

export const uploadChunk = async (req,res) =>{
    try {

        console.log('Uplaoding chunks ');
        const{
            filename,
            chunkIndex,
            uploadId
        } = req.body;
        //console.log(filename,
        //    chunkIndex,
        //    uploadId);
        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
            region: 'ap-south-1'
        })

        const bucketName = process.env.AWS_BUCKET;

        const partParams = {
            Bucket: bucketName,
            Key: filename,
            UploadId: uploadId,
            PartNumber: parseInt(chunkIndex)+1,
            Body: req.file.buffer,
        };

        const data = await s3.uploadPart(partParams).promise();

        console.log("data------- ", data);
        res.status(200).json({ success: true });
        
    } catch (err) {
        console.log('Error uploading chunks: ', err);
        res.status(500).send('Chunk Upload failed');
    }
};


export const completeUpload = async ( req,res) =>{
    try {
        console.log('Completing Upload');
        const{
            filename,
            totalChunks,
            uploadId,
            title,
            description,
            author
        } = req.body;

       

        const uploadedParts = [];

        for(let i = 0; i < totalChunks ; i++){
            uploadedParts.push({
                partnumber: i+1 ,
                ETag: req.body[`part${i+1}`]
            });
        }

        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'ap-south-1'
        });

        const bucketName = process.env.AWS_BUCKET;

        const completeParams = {
            Bucket: bucketName,
            Key: filename,
            UploadId: uploadId,
        };

        const data = await s3.listParts(completeParams).promise();
        
        const parts = data.Parts.map( part =>({
            ETag: part.ETag,
            PartNumber: part.PartNumber
        }));

        completeParams.MultipartUpload = {
            Parts:parts
        }

        const uploadResult = await s3.completeMultipartUpload(completeParams).promise();

        console.log("data ------- ", uploadResult);

        await addVideoDetialsToDB(title , description , author , uploadResult.Key);
        //console.log(uploadResult);
        //pushVideoForEncodingToKafka(title  , uploadResult.Location);

        return res.status(200).json({
            message: "Uploaded Succesfully!!!"
        });

        
    } catch (error) {
        console.error('Error completing upload:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({ 
            error: 'Upload completion failed', 
            details: error.message,
            stack: error.stack
        });
    }

}

export const uploadToDB = async (req , res) =>{
    console.log(" Adding detials to DB ");
    try {
        const videodetails = req.body;
        await addVideoDetialsToDB(videodetails.title,
            videodetails.description, 
            videodetails.author, 
            videodetails.url);

        
    } catch (error) {
        console.log("Error in adding to DB ", error);
        return res.status(400).send(error);
    }
}

export const deleteFromDb = async (req , res) =>{
    console.log(" deleting detials to DB ");
    
    try {
        const { id } = req.body; // Destructure id from req.body
        const videoId = Number(id); 
        if (isNaN(videoId)) {
            throw new Error('The id parameter must be a valid number');
        }

        await deleteVideoFromDB(videoId);
        console.log('Deleted Succesfully');
        return res.status(200).send('Deleted Successfully');

    } catch (error) {
        console.log("Error in adding to DB ", error);
        return res.status(400).send(error);
    }
}