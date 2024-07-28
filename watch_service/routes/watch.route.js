import express from "express"
import watchVideo from "../controllers/watch.controllers.js";
import getAllVideos from "../controllers/home.controllers.js";

const router = express.Router();


router.post('/' , watchVideo);
router.post('/home',getAllVideos );



export default router;