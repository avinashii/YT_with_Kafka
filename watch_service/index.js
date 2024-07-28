import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import watchRoute from "./routes/watch.route.js";
import morgan from 'morgan';


dotenv.config();

const port = process.env.PORT || 8002;
const app = express();


app.use(cors({
    allowedHeaders: ["*"],
    origin:"*"
}));
app.use(morgan()); 

app.use(express.json());

app.use('/watch' , watchRoute);

app.get('/' ,  (req,res) =>{
    res.send("watch_serviceAPI's")
});
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
 })