import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
    {
        title: String,
        content: String,
        createdBy:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: [],
        }

    },
    { timestamps: true }
);

const notesModel = mongoose.model("notes", notesSchema);
export default notesModel;
