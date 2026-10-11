import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // Handle SQLite file URLs or default relative paths
  if (!envUrl || envUrl.startsWith("file:")) {
    const dbFileName = "dev.db";
    const tmpPath = path.join("/tmp", dbFileName);

    // List of candidate paths where Vercel / Next.js NFT bundles dev.db
    const candidatePaths = [
      path.join(process.cwd(), "prisma", dbFileName),
      path.join(process.cwd(), dbFileName),
      path.join(process.cwd(), ".next", "server", "prisma", dbFileName),
      path.resolve(__dirname, "../../prisma", dbFileName),
      path.resolve(__dirname, "../../../prisma", dbFileName),
      path.resolve(__dirname, "../../../../prisma", dbFileName),
    ];

    let sourcePath: string | null = null;
    for (const cand of candidatePaths) {
      try {
        if (fs.existsSync(cand) && fs.statSync(cand).size > 0) {
          sourcePath = cand;
          break;
        }
      } catch (e) {}
    }

    // On Vercel / AWS Lambda environment, copy database to /tmp for full write/WAL support
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production") {
      try {
        if (!fs.existsSync("/tmp")) {
          fs.mkdirSync("/tmp", { recursive: true });
        }

        const tmpExists = fs.existsSync(tmpPath);

        if (sourcePath) {
          if (
            !tmpExists ||
            fs.statSync(tmpPath).size === 0 ||
            fs.statSync(sourcePath).mtimeMs > fs.statSync(tmpPath).mtimeMs
          ) {
            fs.copyFileSync(sourcePath, tmpPath);
          }
        }

        if (fs.existsSync(tmpPath)) {
          return `file:${tmpPath}`;
        }
      } catch (e) {
        console.error("Vercel /tmp database copy warning:", e);
      }
    }

    if (sourcePath) {
      return `file:${sourcePath}`;
    }

    return `file:${tmpPath}`;
  }

  return envUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
