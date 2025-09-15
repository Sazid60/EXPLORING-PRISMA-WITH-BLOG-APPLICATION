import { prisma } from "../../config/db"

/* eslint-disable no-console */
const loginWithEmailAndPassword = async ({ email, password }: { email: string, password: string }) => {
    console.log({ email, password })
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!user) {
        throw new Error("User Not Found!")
    }

    if (password === user.password) {
        return user
    }
    else {
        throw new Error("Password Incorrect!")
    }
}

export const AuthServices = {
    loginWithEmailAndPassword
}