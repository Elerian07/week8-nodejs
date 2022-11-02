import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import connection from "./DB/connection.js";
import * as allRoutes from "./Module/index.route.js";
const app = express();

app.use(express.json());

app.use("/api/v1/user", allRoutes.userRouter);
app.use("/api/v1/auth", allRoutes.authRouter);
app.use("/api/v1/notes", allRoutes.notesRouter);
connection();
app.listen(3000, () => {
    console.log("server running");
});
