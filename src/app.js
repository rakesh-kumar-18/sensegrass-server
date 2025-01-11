import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import fieldRouter from "./routes/field.route.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/fields", fieldRouter);

app.get("/keep-alive", (req, res) => {
    res.status(200).send("Server is alive");
});

app.use(errorHandler);

export default app;
