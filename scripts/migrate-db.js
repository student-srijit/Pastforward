// This script runs Prisma migrations
// Run with: npx tsx scripts/migrate-db.js

import { execSync } from "child_process"

async function runMigrations() {
  try {
    console.log("Running Prisma migrations...")

    // Generate Prisma client
    execSync("npx prisma generate", { stdio: "inherit" })

    // Run migrations
    execSync("npx prisma migrate dev --name add_public_field", { stdio: "inherit" })

    console.log("Migrations completed successfully")
  } catch (error) {
    console.error("Error running migrations:", error)
    process.exit(1)
  }
}

// Run the function
runMigrations()
