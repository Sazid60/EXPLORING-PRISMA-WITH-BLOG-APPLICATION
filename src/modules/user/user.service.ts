import { Prisma, User } from "@prisma/client"
import { prisma } from "../../config/db"

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
    // prism a made this type for us 
    console.log(payload)
    console.log("Create User!")
    const createdUser = await prisma.user.create({
        data: payload
    })
    return createdUser
}

const getAllUsersFromDB = async () => {
    // const result = await prisma.user.findMany()
    // if we want selected fields 
    const result = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            picture: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            status: true
        }
    })
    return result
}
export const UserService = {
    createUser,
    getAllUsersFromDB
}