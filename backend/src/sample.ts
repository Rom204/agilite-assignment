import "dotenv/config";
import { prisma } from "./lib/prisma";

// run "npx tsx src/sample.ts" from the backend directory to execute this script and create a sample ticket in the database. Make sure your database is running and properly configured in your .env file before executing this script.
async function main() {
  // Create a sample ticket
  const sampleTicket = await prisma.ticket.create({
    data: {
        name: "John Doe",
        email: "john.doe@example.com",
        subject: "Sample Ticket",
        message: "This is a sample ticket for testing purposes.",
        productId: 1, // Assuming you have a product with ID 1
    },
  });

  console.log("Sample ticket created:", sampleTicket);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });