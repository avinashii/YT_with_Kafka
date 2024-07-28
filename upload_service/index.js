import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from 'morgan';
import uploadRouter from "./routes/upload.route.js"
import kafkaPublisherRouter from "./routes/kafkaPublisher.route.js"


dotenv.config();
const port = 8001;

const app = express();

app.use(cors({
    allowedHeaders: ["*"],
    origin:"*"
}));
app.use(morgan()); 
app.use(express.json());
app.use('/upload', uploadRouter);
app.use('/publish' , kafkaPublisherRouter );

app.get('/' , (req , res) => {
    res.send("You Tube")
})

app.listen(port , () =>{
    console.log(`Server is running on port http://localhost:${port}`)
})