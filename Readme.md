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
    await prisma.$connect()
    console.log("Database Is Connected")
  } catch (error) {
    console.log("Database Db Connection Failed");
    process.exit(1)
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
    await prisma.$connect()
    console.log("Database Is Connected")
  } catch (error) {
    console.log("Database Db Connection Failed");
    process.exit(1)
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