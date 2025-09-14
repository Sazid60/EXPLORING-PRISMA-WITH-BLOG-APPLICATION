import express from 'express';
import { PostController } from './post.controller';

const router = express.Router();

router.post(
    "/",
    PostController.createPost
)

// get all posts
// get single post
// update post
// delete post

export const postRouter = router;