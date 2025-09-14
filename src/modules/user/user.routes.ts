import express from 'express';
import { UserController } from './user.controller';
const router = express.Router();

router.get("/", UserController.getAllUsersFromDB)
router.get("/:id", UserController.getUserById)

router.post("/", UserController.createUser);
router.patch(
    "/:id",
    UserController.updateUser
)

router.delete(
    "/:id",
    UserController.deleteUser
)

export const UserRouter = router; 
