import express from 'express';
import { UserController } from './user.controller';
const router = express.Router();

router.get("/", UserController.getAllUsersFromDB)
router.post("/", UserController.createUser);

export const UserRouter = router; 
