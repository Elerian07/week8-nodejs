import { Router } from 'express';
import auth from "../../Middleware/auth.js";
import validation from '../../Middleware/validation.js'
import { getNotes, makeNote, updateNote, deleteNote, getNoteById, search, getNoteByUser, softDelete } from './controller/notes.controller.js'
import { createSchema, deleteSchema, noteIdSchema, searchSchema, updateSchema, userNotesSchema } from './notes.validation.js';
const router = Router();

router.get("/", getNotes)
router.get("/getNote/:id", auth(), validation(noteIdSchema), getNoteById)
router.post("/addNote", auth(), validation(createSchema), makeNote)
router.patch("/uptadeNote/:id", auth(), validation(updateSchema), updateNote)
router.delete("/deleteNote/:id", auth(), validation(deleteSchema), deleteNote)
router.get("/search", auth(), validation(searchSchema), search)
router.get("/getNoteUser/:id", auth(), validation(userNotesSchema), getNoteByUser)
router.delete("/softDelete/:id", auth(), validation(deleteSchema), softDelete)
export default router;