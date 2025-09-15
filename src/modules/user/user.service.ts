/* eslint-disable no-console */
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

// const getAllUsersFromDB = async () => {
//     // const result = await prisma.user.findMany()
//     // if we want selected fields 
//     const result = await prisma.user.findMany({
//         select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//             picture: true,
//             createdAt: true,
//             updatedAt: true,
//             role: true,
//             status: true
//         },
//         orderBy :{
//             createdAt : "desc"
//         }
//     })
//     return result
// }
const getAllUsersFromDB = async () => {
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
            status: true,
            posts: true
        },
        orderBy: {
            createdAt: "desc"
        },
        // include :{
        //     posts : true
        // }
    })
    return result
}

const getUserById = async (id: number) => {
    const result = prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            picture: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            status: true,
            posts: true

        }
    })
    return result
}

const updateUser = async (id: number, payload: Partial<User>) => {
    const result = await prisma.user.update({
        where: {
            id
        },
        data: payload
    })
    return result;
}

const deleteUser = async (id: number) => {
    const result = await prisma.user.delete({
        where: {
            id
        }
    })
    return result;
}

export const UserService = {
    createUser,
    getAllUsersFromDB,
    getUserById,
    updateUser,
    deleteUser
}

