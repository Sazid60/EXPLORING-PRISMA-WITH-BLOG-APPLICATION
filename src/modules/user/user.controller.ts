import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async (req:Request, res:Response) =>{
    try {
        const result = await UserService.createUser(req.body)
        res.status(201).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
} 
const getAllUsersFromDB = async (req:Request, res:Response) =>{
    try {
        const result = await UserService.getAllUsersFromDB()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).send(error)
    }
} 

export const UserController = {
    createUser,
    getAllUsersFromDB
}