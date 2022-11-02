import mongoose from "mongoose";

const trashCanSchema = new mongoose.Schema({
    userName: { type: String },
    email: {
        type: String
    },
    password: {
        type: String
    },
    age: { type: Number },
    phone: { type: Number },
    isDeleted: {
        type: Boolean,
        default: true,
    },
    title: { type: String },
    content: { type: String },
    createdBy:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",

    }

});

const trashCanModel = mongoose.model("trash can", trashCanSchema);

export default trashCanModel;
