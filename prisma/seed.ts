import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Placement Department database...");

  // 1. Seed Admin Account
  const adminEmail = process.env.ADMIN_DEFAULT_USERNAME || process.env.ADMIN_DEFAULT_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // Clean up legacy admin users if necessary
  await prisma.admin.deleteMany({
    where: {
      email: { not: adminEmail }
    }
  }).catch(() => {});

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { 
      passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null
    },
    create: {
      email: adminEmail,
      username: "admin",
      passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null
    },
  });
  console.log(`✓ Admin user ready (${adminEmail})`);

  // 2. Seed HOD Profile
  const existingHod = await prisma.hodProfile.findFirst();
  if (!existingHod) {
    await prisma.hodProfile.create({
      data: {
        name: "Prof. Mahima Sahay",
        designation: "Head of Department — Placement & Personality Development",
        photoUrl: "/hod-photo.jpg",
        mobile: "+91 98765 43210",
        email: "hod.placement@srgi.ac.in",
        welcomeMessage: "Welcome to the Placement & Personality Development (PD) Web Portal of S R Group of Institutions, Lucknow! Our department is dedicated to empowering students through technical evaluation, personalized interview preparation, ATS resume building, and placement screening rounds to ensure top campus recruitment success.",
      },
    });
    console.log("✓ HOD Profile seeded");
  }

  // 3. Seed Default System Settings
  await prisma.systemSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      isScheduledRoundOpen: false,
    },
  });
  console.log("✓ System settings seeded");

  // 4. Seed Default Branch Options
  const defaultBranches = [
    { code: "IT", name: "Information Technology (IT)" },
    { code: "CS", name: "Computer Science & Engineering (CS)" },
    { code: "AIML", name: "AI & Machine Learning (AIML)" },
    { code: "DS", name: "Data Science (DS)" },
    { code: "EC", name: "Electronics & Communication (EC)" },
    { code: "EN", name: "Electrical & Electronics (EN)" },
  ];

  for (const b of defaultBranches) {
    await prisma.branchOption.upsert({
      where: { code: b.code },
      update: { name: b.name },
      create: b,
    });
  }
  console.log("✓ Default branches seeded");

  // 5. Seed Default Preferred Field Options
  const defaultFields = [
    "Software Developer",
    "Data Scientist",
    "Data Analyst",
    "Web Developer",
    "Core/Electronics Engineer",
    "Networking",
    "Cybersecurity",
    "Other",
  ];

  for (const name of defaultFields) {
    await prisma.fieldOption.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✓ Default fields seeded");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
