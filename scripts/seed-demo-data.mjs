import { randomBytes } from "node:crypto";
import { MongoClient, ObjectId } from "mongodb";

const seedId = "fixora-demo-seed-v1";
const databaseName = process.env.MONGODB_DATABASE ?? "fixoraClientDb";
const baseUrl = process.env.DEMO_SEED_BASE_URL ?? "http://localhost:3000";

if (!process.argv.includes("--confirm-nonproduction")) {
  throw new Error("Refusing to seed without --confirm-nonproduction.");
}

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required.");
}

if (/(^|[_-])prod(uction)?($|[_-])/i.test(databaseName)) {
  throw new Error(`Refusing to seed a production-named database: ${databaseName}.`);
}

const appUrl = new URL(baseUrl);
if (!["localhost", "127.0.0.1", "::1"].includes(appUrl.hostname)) {
  throw new Error("The auth API must use a local FIXORA instance.");
}

const technicians = [
  {
    name: "Nusrat Jahan",
    email: "demo.tech01@fixora-demo.test",
    phone: "+8801712345001",
    area: "Dhanmondi, Dhaka",
    bio: "Smartphone repair specialist focused on screen, battery, and charging faults. I explain the diagnosis and repair options before work begins.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    specialty: "Smartphone",
  },
  {
    name: "Arif Hossain",
    email: "demo.tech02@fixora-demo.test",
    phone: "+8801712345002",
    area: "Uttara, Dhaka",
    bio: "Laptop technician experienced with Windows and Mac hardware, SSD upgrades, thermal issues, and careful data-safe diagnostics.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    specialty: "Laptop & PC",
  },
  {
    name: "Farhan Ahmed",
    email: "demo.tech03@fixora-demo.test",
    phone: "+8801712345003",
    area: "Agrabad, Chattogram",
    bio: "Air-conditioning service technician handling routine maintenance, cooling problems, drainage, and inverter unit diagnostics.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    specialty: "AC",
  },
  {
    name: "Maliha Rahman",
    email: "demo.tech04@fixora-demo.test",
    phone: "+8801712345004",
    area: "Zindabazar, Sylhet",
    bio: "Home appliance technician specializing in refrigerator cooling, compressor, thermostat, and door-seal issues.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    specialty: "Refrigerator",
  },
  {
    name: "Sabbir Kabir",
    email: "demo.tech05@fixora-demo.test",
    phone: "+8801712345005",
    area: "Mirpur, Dhaka",
    bio: "Washing-machine repair specialist for drainage, spin-cycle, vibration, and control-board problems across common models.",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
    specialty: "Washing Machine",
  },
];

const imageByCategory = {
  Smartphone: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80",
  "Laptop & PC": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80",
  AC: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
  Refrigerator: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=80",
  "Washing Machine": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80",
};

const serviceTemplates = [
  ["Smartphone Screen Replacement", "Smartphone", 1800, "Replace a cracked display after a device inspection, with touch and brightness checks before handover.", "1–2 hours", "Shop Drop-off", "approved"],
  ["Phone Battery Replacement", "Smartphone", 1200, "Diagnose rapid battery drain and install a compatible replacement with charging and safety checks.", "1–2 hours", "Shop Drop-off", "approved"],
  ["Charging Port Repair", "Smartphone", 900, "Clean and diagnose charging faults, then repair or replace the port where needed.", "1–3 hours", "Shop Drop-off", "approved"],
  ["Laptop SSD Upgrade", "Laptop & PC", 2800, "Upgrade storage with a compatible SSD and verify boot, health, and basic system performance.", "2–3 hours", "Shop Drop-off", "approved"],
  ["Laptop Thermal Service", "Laptop & PC", 1500, "Clean cooling fans, inspect airflow, and refresh thermal compound to address overheating.", "2–3 hours", "Shop Drop-off", "approved"],
  ["Laptop Diagnostics and Repair", "Laptop & PC", 1000, "Trace startup, power, or performance problems and provide a repair estimate before parts are fitted.", "1 day", "Shop Drop-off", "approved"],
  ["AC Deep Cleaning", "AC", 1600, "Clean filters and coils, inspect drainage, and test cooling performance for a split air conditioner.", "1–2 hours", "Home Visit", "approved"],
  ["AC Cooling and Gas Leak Check", "AC", 2200, "Check cooling output and refrigerant lines, then explain any recommended repair before proceeding.", "2–3 hours", "Home Visit", "approved"],
  ["Inverter AC Board Diagnosis", "AC", 2500, "Inspect inverter controls, sensors, and electrical connections to identify intermittent cooling faults.", "2–4 hours", "Home Visit", "approved"],
  ["Refrigerator Cooling Repair", "Refrigerator", 1800, "Diagnose weak cooling, inspect airflow and controls, and recommend the appropriate repair.", "2–4 hours", "Home Visit", "approved"],
  ["Refrigerator Compressor Service", "Refrigerator", 3200, "Inspect compressor start components and cooling cycle; parts replacement is quoted separately.", "1 day", "Home Visit", "pending"],
  ["Fridge Thermostat Replacement", "Refrigerator", 1400, "Test temperature controls and replace a faulty thermostat or sensor with a compatible part.", "2–3 hours", "Home Visit", "approved"],
  ["Washing Machine Drain Repair", "Washing Machine", 1300, "Inspect the drain filter, hose, and pump to resolve standing water or slow drainage.", "1–2 hours", "Home Visit", "approved"],
  ["Washer Spin Cycle Repair", "Washing Machine", 1900, "Diagnose spin-cycle faults, vibration, and load-balance issues for front- or top-load machines.", "2–4 hours", "Home Visit", "pending"],
  ["Washing Machine Control Diagnosis", "Washing Machine", 1700, "Check error codes, control connections, and cycle behavior before recommending a board repair.", "2–4 hours", "Home Visit", "pending"],
];

const bookingTemplates = [
  ["requested", 0, "A phone screen is cracked and touch input is unreliable.", 2, "unpaid"],
  ["accepted", 3, "The laptop is very slow and needs an SSD upgrade.", 1, "unpaid"],
  ["in-progress", 6, "The air conditioner runs but is not cooling the room.", 0, "unpaid"],
  ["completed", 9, "The refrigerator section is not staying cold.", -2, "paid"],
  ["completed", 12, "The washing machine leaves water in the drum after a cycle.", -4, "unpaid"],
  ["rejected", 1, "The phone battery drains quickly even after a full charge.", 1, "unpaid"],
  ["cancelled", 4, "The laptop fan is noisy and the device becomes hot.", -1, "unpaid"],
];

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const createdCredentials = [];

function randomPassword() {
  return `FxDemo!${randomBytes(18).toString("base64url")}`;
}

function serviceSeedKey(index) {
  return `${seedId}:service:${String(index + 1).padStart(2, "0")}`;
}

function bookingSeedKey(index) {
  return `${seedId}:booking:${String(index + 1).padStart(2, "0")}`;
}

async function createTechnician(baseUrl, technician, password) {
  const response = await fetch(new URL("/api/auth/sign-up/email", baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: baseUrl,
    },
    body: JSON.stringify({
      name: technician.name,
      email: technician.email,
      password,
      role: "technician",
      phone: technician.phone,
      area: technician.area,
      bio: technician.bio,
      image: technician.image,
      callbackURL: "/",
    }),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `Could not create ${technician.email}: ${result?.message ?? result?.error ?? `HTTP ${response.status}`}`,
    );
  }
}

async function upsertService(db, index, technician, template) {
  const [title, category, basePrice, description, estimatedDuration, serviceMode, approvalStatus] = template;
  const now = new Date();
  const document = {
    _id: new ObjectId(),
    seedKey: serviceSeedKey(index),
    title,
    category,
    description,
    image: imageByCategory[category],
    basePrice,
    estimatedDuration,
    serviceMode,
    serviceArea: technician.area,
    technicianName: technician.name,
    technicianEmail: technician.email,
    approvalStatus,
    isAvailable: true,
    createdAt: new Date(now.getTime() - index * 60 * 60 * 1000),
    updatedAt: now,
  };
  await db.collection("services").updateOne(
    { seedKey: document.seedKey },
    { $setOnInsert: document },
    { upsert: true },
  );
  return db.collection("services").findOne({ seedKey: document.seedKey });
}

async function upsertBooking(db, index, service, template) {
  const [status, customerIndex, problemDescription, dayOffset, paymentStatus] = template;
  const now = new Date();
  const preferredDate = new Date(now);
  preferredDate.setUTCDate(preferredDate.getUTCDate() + dayOffset);
  preferredDate.setUTCHours(0, 0, 0, 0);
  const booking = {
    _id: new ObjectId(),
    seedKey: bookingSeedKey(index),
    serviceId: service._id.toString(),
    serviceTitle: service.title,
    serviceImage: service.image,
    category: service.category,
    basePrice: service.basePrice,
    technicianName: service.technicianName,
    technicianEmail: service.technicianEmail,
    customerName: [
      "Samira Chowdhury",
      "Imran Hossain",
      "Tanjim Rahman",
      "Raisa Ahmed",
      "Mehedi Hasan",
      "Nabila Sultana",
      "Tanvir Islam",
    ][index],
    customerEmail: `demo.customer${String(customerIndex + 1).padStart(2, "0")}@example.test`,
    customerPhone: `+88018123456${String(customerIndex + 1).padStart(2, "0")}`,
    address: [
      "House 18, Road 7, Dhanmondi, Dhaka",
      "Sector 4, Uttara, Dhaka",
      "Road 12, Agrabad, Chattogram",
      "Amberkhana, Sylhet",
      "Block C, Mirpur 10, Dhaka",
      "Lalmatia, Dhaka",
      "Shahjalal Uposhohor, Sylhet",
    ][index],
    preferredDate,
    problemDescription,
    status,
    finalAmount: status === "completed" ? service.basePrice + 350 : service.basePrice,
    paymentStatus,
    createdAt: new Date(now.getTime() - (index + 1) * 24 * 60 * 60 * 1000),
    updatedAt: now,
  };
  await db.collection("bookings").updateOne(
    { seedKey: booking.seedKey },
    { $setOnInsert: booking },
    { upsert: true },
  );
  return db.collection("bookings").findOne({ seedKey: booking.seedKey });
}

async function main() {
  await mongoClient.connect();
  const db = mongoClient.db(databaseName);
  const ledger = db.collection("demoSeedLedger");
  const existingRun = await ledger.findOne({ seedId });
  if (existingRun?.status === "complete") {
    console.log("FIXORA demo data is already seeded; no records were changed.");
    return;
  }
  if (existingRun) {
    throw new Error("A previous seed run is incomplete. Inspect the demoSeedLedger record before retrying.");
  }

  const userCollection = db.collection("user");
  const existingAccounts = await userCollection
    .find({ email: { $in: technicians.map((technician) => technician.email) } }, { projection: { email: 1 } })
    .toArray();
  if (existingAccounts.length > 0) {
    throw new Error(
      `Refusing to change existing accounts. Demo email already exists: ${existingAccounts.map((user) => user.email).join(", ")}`,
    );
  }

  const authHealth = await fetch(new URL("/api/auth/get-session", baseUrl));
  if (!authHealth.ok) {
    throw new Error(`Local FIXORA auth is unavailable (HTTP ${authHealth.status}). Start the app before seeding.`);
  }

  await ledger.insertOne({
    seedId,
    status: "in-progress",
    startedAt: new Date(),
    databaseName,
  });

  try {
    const passwords = technicians.map(randomPassword);
    for (let index = 0; index < technicians.length; index += 1) {
      await createTechnician(baseUrl, technicians[index], passwords[index]);
      createdCredentials.push({
        name: technicians[index].name,
        email: technicians[index].email,
        password: passwords[index],
      });
    }

    const services = [];
    for (let index = 0; index < serviceTemplates.length; index += 1) {
      const technician = technicians[Math.floor(index / 3)];
      services.push(await upsertService(db, index, technician, serviceTemplates[index]));
    }

    const bookings = [];
    for (let index = 0; index < bookingTemplates.length; index += 1) {
      bookings.push(await upsertBooking(db, index, services[bookingTemplates[index][1]], bookingTemplates[index]));
    }

    const paidBooking = bookings.find((booking) => booking.paymentStatus === "paid");
    if (paidBooking) {
      await db.collection("payments").updateOne(
        { transactionId: `${seedId}:payment:01` },
        {
          $setOnInsert: {
            bookingId: paidBooking._id.toString(),
            customerName: paidBooking.customerName,
            customerEmail: paidBooking.customerEmail,
            technicianName: paidBooking.technicianName,
            technicianEmail: paidBooking.technicianEmail,
            serviceTitle: paidBooking.serviceTitle,
            amount: paidBooking.finalAmount,
            currency: "bdt",
            transactionId: `${seedId}:payment:01`,
            paidAt: new Date(paidBooking.createdAt),
          },
        },
        { upsert: true },
      );
    }

    await ledger.updateOne(
      { seedId },
      {
        $set: {
          status: "complete",
          completedAt: new Date(),
          technicianCount: technicians.length,
          serviceCount: serviceTemplates.length,
          approvedServiceCount: serviceTemplates.filter((service) => service[6] === "approved").length,
          bookingCount: bookingTemplates.length,
        },
      },
    );

    console.log(`Seeded ${technicians.length} technicians, ${serviceTemplates.length} services (12 approved, 3 pending), and ${bookings.length} bookings.`);
  } finally {
    if (createdCredentials.length > 0) {
      console.log("\nTemporary demo technician credentials (save for testing; change them after first use):");
      for (const credential of createdCredentials) {
        console.log(`${credential.name} | ${credential.email} | ${credential.password}`);
      }
    }
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Demo seed failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoClient.close();
  });
