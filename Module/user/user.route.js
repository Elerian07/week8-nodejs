import { Router } from 'express';
import auth from "../../Middleware/auth.js";
import validation from '../../Middleware/validation.js'
import { deleteSchema, getUserSchema } from './user.validation.js';
import { getAllUsers, getUser, changePassword, deleteById, softDelete } from './controller/user.controller.js'
const router = Router();

router.get("/getAllUsers", auth(), getAllUsers)
router.get("/getuser/:id", auth(), validation(getUserSchema), getUser)
router.patch("/changePassword", auth(), changePassword)
router.delete("/deleteUser", auth(), validation(deleteSchema), deleteById)
router.delete("/softDelete", auth(), validation(deleteSchema), softDelete)
export default router;