import { prisma } from "../../config/db"

const createUser = async(payload:any) =>{
    console.log(payload)
    console.log("Create User!")
    const createdUser = await prisma.user.create({
        data : payload
    })
    return createdUser
}

export const UserService = {
    createUser
}