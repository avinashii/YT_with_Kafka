import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import KafkaConfig from "../upload_service/kafka/kafka.js"
import S3ToS3 from "./hls/S3TOS3.js";


dotenv.config();

const port = 8081;

const app = express();

app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
}));

app.use(express.json());

app.get('/' , (req,res)=>{
    
    res.send("YT service transcoder")
})

app.get('/transcode' , (req,res) =>{
    S3ToS3();
    res.send('HHLD YT service transcoder')
});

// const kafkaconfig = KafkaConfig();

// kafkaconfig.consume("transcode" , (value) =>{
//     console.log("Got data from kafka : ",value)
// })

app.listen(port , () =>{
    console.log(`Server is running on http://localhost:${port}`);
});