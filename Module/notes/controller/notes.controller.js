import notesModel from '../../../DB/model/notes.model.js'
import trashCanModel from '../../../DB/model/trashCan.model.js'

export const getNotes = async (req, res) => {
    try {
        const getNotes = await notsModel.find({})
        res.json({ message: "Done", getNotes })
    } catch (error) {
        res.json({ message: "error", error })
    }
}


export const makeNote = async (req, res) => {
    try {
        let { title, content } = req.body;
        const makeNote = await notesModel({ title, content, createdBy: req.userId });
        const saveNote = makeNote.save();
        res.json({ message: "added", makeNote })
    } catch (error) {
        res.json({ message: "error", error })

    }

}

export const updateNote = async (req, res) => {
    try {
        let { title, content } = req.body;
        let { id } = req.params;
        const updateNote = await notesModel.findByIdAndUpdate({ _id: id }, { title, content }, { new: true })
        res.json({ message: "updated", updateNote })
    } catch (error) {
        res.json({ message: "error", error })
    }
}

export const deleteNote = async (req, res) => {
    try {
        let { id } = req.params;
        const deleteNote = await notesModel.findByIdAndDelete({ _id: id });
        if (deleteNote) {
            if (deleteNote.createdBy.equals(req.userId)) {

                res.json({ message: "deleted", deleteNote });
            } else {
                res.json({ message: "you are not authorized to delete this note" })
            }
        } else {
            res.json({ message: "id not found" });
        }
    } catch (error) {
        res.json({ message: "error", error })
    }
};


export const getNoteById = async (req, res) => {
    try {
        let { id } = req.params;
        const getNote = await notesModel.findById({ _id: id })
        res.json({ message: "Done", getNote })
    } catch (error) {
        res.json({ message: "error", error })
    }
}

export const search = async (req, res) => {
    try {
        const { search } = req.query;
        let note = await notesModel.find({ createdBy: req.userId })
        if (note) {
            let searchNote = await notesModel.findOne({
                $or: [{ title: { $regex: req.query.search } },
                { content: { $regex: req.query.search } }],
                $and: [{ createdBy: req.userId }]
            })
            if (searchNote == null) {

                res.json({ message: "no note founded" })
            } else {
                res.json({ message: "found note", searchNote })

            }
        } else {
            res.json({ message: "no notes for this user" })
        }
    } catch (error) {
        res.json({ message: "error", error })
    }
}


export const getNoteByUser = async (req, res) => {
    try {
        let { id } = req.params;
        const note = await notesModel.find({ createdBy: id })
        res.json({ message: "found note", note })
    } catch (error) {
        res.json({ message: "error", error })
    }
}


export const softDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await notesModel.findById({ _id: id });
        if (note) {
            if (note.createdBy.equals(req.userId)) {
                let note = await notesModel.findByIdAndUpdate({ _id: id }, { isDeleted: true },
                    { new: true })
                const trashUser = await trashCanModel.insertMany(note);
                const deletedNote = await notesModel.findByIdAndDelete({ _id: id });
                res.json({ message: "note is deleted", deletedNote })

            } else {
                res.json({ message: "you are not authorized to delete this note" })
            }
        } else {
            res.json({ message: "id not found" })
        }


    } catch (error) {
        res.json({ message: "error", error })
    }

}