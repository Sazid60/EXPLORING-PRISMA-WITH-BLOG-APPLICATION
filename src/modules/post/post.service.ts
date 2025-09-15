/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const createPost = async (payload: Prisma.PostCreateInput): Promise<Post> => {
    const result = await prisma.post.create({
        data: payload,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    })

    return result;
}

const getAllPosts = async ({ page = 1, limit = 10, search, isFeatured, tags, sortBy, sortOrder }: { page?: number, limit?: number, search?: string, isFeatured?: boolean, tags?: string[], sortBy: string, sortOrder: string }) => {

    console.log(page, limit)
    const skip = (page - 1) * limit


    // console.log({ tags })
    const where: any = {
        AND: [
            search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } }
                ]
            },
            typeof isFeatured === "boolean" && { isFeatured },
            tags && tags?.length > 0 && { tags: { hasEvery: tags } }
        ].filter(Boolean) // for filtering we have to tell explicitly 
    }
    const result = await prisma.post.findMany({
        skip,
        take: limit,
        where,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = await prisma.post.count({ where })

    return {
        data: result,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        },
    };
};

const getPostById = async (id: number) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: { id },
            data: {
                views: {
                    increment: 1
                }
            }
        });
        return await tx.post.findUnique({
            where: { id },
            include: { author: true },
        });


    })
};

const updatePost = async (id: number, data: Partial<Post>) => {
    return prisma.post.update({ where: { id }, data });
};

const deletePost = async (id: number) => {
    return prisma.post.delete({ where: { id } });
};

export const PostService = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
}