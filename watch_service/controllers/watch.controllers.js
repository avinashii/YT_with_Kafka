import AWS from 'aws-sdk';

async function generateSignedURL(videoKey){

    let videourl = videoKey;
    console.log(videourl);
    const s3 = new AWS.S3({
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY  ,
        region: 'ap-south-1'
    });
    const bucketName = process.env.AWS_BUCKET;
    const params = {
        Bucket: bucketName,
        Key: videourl,
        Expires: 300
    };

    return new Promise((resolve,reject) =>{
        s3.getSignedUrl('getObject', params, (err, url) => {
            if (err) {
                reject(err);
            }
            else{
                resolve(url);
            }
        });
    });
}

const watchVideo = async(req,res) =>{
    try {
        const video = (req.query.key);
        if (!video || typeof video !== 'string') {
            return res.status(400).json({ error: 'Invalid video data' });
        }

        //console.log('Generating signed URL for video:', videos);
        const signedURL = await generateSignedURL(video);
        //console.log(signedURL);
        res.json(signedURL);
        
    } catch (err) {
        console.error('Error generating pre-signed URL: ', err);
        res.status(500).json({
            error:'Internal Server Error'
        });
    }
}

export default watchVideo;