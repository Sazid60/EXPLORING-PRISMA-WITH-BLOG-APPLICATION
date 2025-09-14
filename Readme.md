## Exploring Prisma With Blog Application Part-1

Starter Pack GitHub: https://github.com/Apollo-Level2-Web-Dev/next-blog-starter

Next Blog Server GitHub: https://github.com/Apollo-Level2-Web-Dev/next-blog-server

## 49-1 Clone Starter Project and Run

- clone the repo and setup
- lets install prisma

[prisma with postgres](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-prismaPostgres)

```
npm install prisma typescript tsx @types/node --save-dev

```

```
npx prisma init
```

- set the env from here

[env](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql)

## 49-2 Setup Prisma in Starter Project

- install the prisma client as we have not migrated yet for t5his project

```
npm install @prisma/client
```

- still not auto suggestion coming ?

```
npx prisma generate
```

- src -> config -> db.ts (this is the prisma client configuration)

```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

- src -> server.ts

```ts
async function connectToDB() {
  try {
    await prisma.$connect();
    console.log("Database Is Connected");
  } catch (error) {
    console.log("Database Db Connection Failed");
    process.exit(1);
  }
}
async function startServer() {
  try {
    await connectToDB();
    server = http.createServer(app);
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });

    handleProcessEvents();
  } catch (error) {
    console.error("❌ Error during server startup:", error);
    process.exit(1);
  }
}
```

```ts
import http, { Server } from "http";
import app from "./app";
import dotenv from "dotenv";
import { prisma } from "./config/db";

dotenv.config();

let server: Server | null = null;

async function connectToDB() {
  try {
    await prisma.$connect();
    console.log("Database Is Connected");
  } catch (error) {
    console.log("Database Db Connection Failed");
    process.exit(1);
  }
}
async function startServer() {
  try {
    await connectToDB();
    server = http.createServer(app);
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });

    handleProcessEvents();
  } catch (error) {
    console.error("❌ Error during server startup:", error);
    process.exit(1);
  }
}

/**
 * Gracefully shutdown the server and close database connections.
 * @param {string} signal - The termination signal received.
 */
async function gracefulShutdown(signal: string) {
  console.warn(`🔄 Received ${signal}, shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log("✅ HTTP server closed.");

      try {
        console.log("Server shutdown complete.");
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
      }

      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

/**
 * Handle system signals and unexpected errors.
 */
function handleProcessEvents() {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("uncaughtException", (error) => {
    console.error("💥 Uncaught Exception:", error);
    gracefulShutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Rejection:", reason);
    gracefulShutdown("unhandledRejection");
  });
}

// Start the application
startServer();
```

## 49-3 Requirement Analysis (User, Post)

- there is a bug in connecting the database
- as we have nothing inside schema and we didn't do any migration so the bridge is not created for this reason this error is coming
- prisma -> prisma.schema (create user schema)

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id Int @id @default(autoincrement())
}
```

- migrate it

```
npx prisma migrate dev
```

- now run

```
npm run dev
```

- now this will run the server

#### Lets understand the Blog App project first

![alt text](image.png)

## 49-4 Write User and Post Models in Prisma Schema

- user and post Schema

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         Int        @id @default(autoincrement())
  name       String
  email      String
  password   String?
  role       Role       @default(USER)
  phone      String
  picture    String?
  status     UserStatus @default(ACTIVE)
  isVerified Boolean    @default(false)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
}

model Post {
  id         Int      @id @default(autoincrement())
  title      String
  content    String
  thumbnail  String?
  isFeatured Boolean  @default(false)
  tags       String[]
  views      Int      @default(0)
  authorId   Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum Role {
  SUPER_ADMIN
  ADMIN
  USER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BLOCKED
}

```

- migrate it

```
npx prisma migrate dev
```

## 49-5 One-to-Many Relation in Prisma

![alt text](image-1.png)

- lets make the relation

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         Int        @id @default(autoincrement())
  name       String
  email      String
  password   String?
  role       Role       @default(USER)
  phone      String
  picture    String?
  status     UserStatus @default(ACTIVE)
  isVerified Boolean    @default(false)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  Posts       Post[] // relationship making
}

model Post {
  id         Int      @id @default(autoincrement())
  title      String
  content    String
  thumbnail  String?
  isFeatured Boolean  @default(false)
  tags       String[]
  views      Int      @default(0)
  authorId   Int
  author     User     @relation(fields: [authorId], references: [id]) // for relationship
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum Role {
  SUPER_ADMIN
  ADMIN
  USER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BLOCKED
}

```

```
npx prisma migrate dev
```

- create src -> modules -> user -> user.controller.ts , user.route.ts, user.service.ts

## 49-6 Create User in Database

- app.ts (router connected)

```ts
import compression from "compression";
import cors from "cors";
import express from "express";
import { UserRouter } from "./modules/user/user.routes";

const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/user", UserRouter); // added the route

// Default route for testing
app.get("/", (_req, res) => {
  res.send("API is running");
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
```

- src -> modules -> user -> user.route.ts

```ts
import express from "express";
import { UserController } from "./user.controller";
const router = express.Router();

router.post("/", UserController.createUser);

export const UserRouter = router;
```

- src -> modules -> user -> user.controller.ts

```ts
import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createUser(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
};

export const UserController = {
  createUser,
};
```

- src -> modules -> user -> user.service.ts

```ts
import { prisma } from "../../config/db";

const createUser = async (payload: any) => {
  console.log(payload);
  console.log("Create User!");
  const createdUser = await prisma.user.create({
    data: payload,
  });
  return createdUser;
};

export const UserService = {
  createUser,
};
```

- now hit is postman

```json
{
  "id": 3,
  "name": "Charlie Brown",
  "email": "charlie@example.com",
  "phone": "+8801700000003"
}
```

## 49-7 Get All Users

- Prisma is type safety

- user.service.ts

```ts
import { Prisma, User } from "@prisma/client";
import { prisma } from "../../config/db";

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
  // prism a made this type for us
  console.log(payload);
  console.log("Create User!");
  const createdUser = await prisma.user.create({
    data: payload,
  });
  return createdUser;
};

export const UserService = {
  createUser,
};
```

- now lets retrieve data

- user.service.ts

```ts
import { Prisma, User } from "@prisma/client";
import { prisma } from "../../config/db";

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
  // prism a made this type for us
  console.log(payload);
  console.log("Create User!");
  const createdUser = await prisma.user.create({
    data: payload,
  });
  return createdUser;
};

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
      status: true,
    },
  });
  return result;
};
export const UserService = {
  createUser,
  getAllUsersFromDB,
};
```
- user.controller.ts 

```ts 
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
```

- user.route.ts 

```ts
import express from 'express';
import { UserController } from './user.controller';
const router = express.Router();

router.get("/", UserController.getAllUsersFromDB)
router.post("/", UserController.createUser);

export const UserRouter = router; 

```

## 49-8 Get User by ID

- we can do sorting as well - > user.service.ts 

```ts

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
        },
        orderBy :{
            createdAt : "desc"
        }
    })
    return result
}

```

- if we ant to populate we can mention in `select`

- There is another method of populating is `include`. remember if we use `select` we do not seed to use `include` and if we use `include` there is no need of using `select`

```ts 
const getAllUsersFromDB = async () => {
    const result = await prisma.user.findMany({
        // select: {
        //     id: true,
        //     name: true,
        //     email: true,
        //     phone: true,
        //     picture: true,
        //     createdAt: true,
        //     updatedAt: true,
        //     role: true,
        //     status: true
        // },
        orderBy: {
            createdAt: "desc"
        },
        include :{
            posts : true
        }
    })
return result
}
```

```ts 
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
            posts : true
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
```

- get single user by id 
- user.routes.ts 
```ts 
import express from 'express';
import { UserController } from './user.controller';
const router = express.Router();

router.get("/", UserController.getAllUsersFromDB)
router.get("/:id", UserController.getUserById)
router.post("/", UserController.createUser);

export const UserRouter = router; 

```
- user.controller.ts 

```ts 
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
const getUserById = async (req:Request, res:Response) =>{
    try {
       
        const result = await UserService.getUserById(Number(req.params.id))
        res.status(200).json(result)
    } catch (error) {
        res.status(500).send(error)
    }
} 

export const UserController = {
    createUser,
    getAllUsersFromDB,
    getUserById
}
```

- user.service.ts 

```ts 
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

const getUserById = async(id:number) =>{
    const result = prisma.user.findUnique({
        where :{
            id
        }
    })
    return result 
}
export const UserService = {
    createUser,
    getAllUsersFromDB,
    getUserById
}

```

## 49-9 -Create Post in Database

- post.service.ts 

```ts 
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

export const PostService = {
    createPost
}
```

- post.controller.ts 

```ts 
import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        const result = await PostService.createPost(req.body)
        res.status(201).json(result);
    } catch (error) {
        res.status(500).send(error)
    }
}

export const PostController = {
    createPost
}
```
- post.router.ts 

```ts 
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
```

- app.ts 

```ts 
import compression from "compression";
import cors from "cors";
import express from "express";
import { UserRouter } from "./modules/user/user.routes";
import { postRouter } from "./modules/post/post.router";

const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/user", UserRouter) // added the route
app.use("/api/v1/post", postRouter) // added the route

// Default route for testing
app.get("/", (_req, res) => {
  res.send("API is running");
});


// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;

```

- postman 


```json 
{
  "title": "Getting Started with Prisma ORM",
  "content": "In this post, we will explore how to set up Prisma ORM with a PostgreSQL database, generate the client, and run queries easily.",
  "thumbnail": "https://example.com/thumbnails/prisma-guide.png",
  "isFeatured": true,
  "tags": ["prisma", "nodejs", "typescript", "postgresql"],
  "authorId": 3
}

```