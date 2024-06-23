import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./dataBase/dbConnection.js";
import { errorMiddelware } from "./middleware/error.js";
import messageRoute from './routes/message.route.js'
import userRoute from './routes/user.route.js'





const app = express();
dotenv.config({ path: ".env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URI, process.env.ADMIN_URI],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true
  })
);

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({useTempFiles:true,
    tempFileDir:'/tmp/'
}))
app.use('/api/v1/message',messageRoute)
app.use('/api/v1/user',userRoute)

dbConnection()
app.use(errorMiddelware)


export default app;
