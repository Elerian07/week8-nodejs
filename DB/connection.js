import mongoose from "mongoose";

const connection = async () => {
    return await mongoose
        .connect(process.env.DBCONNECT)
        .then(() => {
            console.log("database connected");
        })
        .catch(() => {
            console.log("database connection error");
        });
};

export default connection;
