import express from 'express';
import { AuthController } from './auth.controller';


const router = express.Router();

router.post(
    "/",
    AuthController.loginWithEmailAndPassword
)


export const AuthRouter = router;