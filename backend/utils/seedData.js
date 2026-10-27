import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Citizen from "../models/citizen.model.js";
import Issue from "../models/issue.model.js";
import Grievance from "../models/grievance.model.js";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const sampleIssues = [
  {
    title: "Hazardous Deep Pothole on 100ft Road",
    description: "Large 2-foot wide pothole right at the intersection. Two-wheelers frequently lose balance after dark. Needs asphalt patching urgently.",
    category: "Roads & Potholes",
    location: "100ft Road, Near Junction 12, Indiranagar",
    pincode: "560038",
    priority: "CRITICAL",
    status: "REPORTED",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    upvotesCount: 24,
    department: "Roads & Bridges - Public Works Dept (PWD)",
  },
  {
    title: "Overflowing Garbage Dumpster Blocking Sidewalk",
    description: "Municipal waste container has not been cleared for over 4 days. Waste is spilling onto the pedestrian footpath, attracting stray animals and creating health hazards.",
    category: "Sanitation & Waste",
    location: "80ft Road, 4th Block, Koramangala",
    pincode: "560034",
    priority: "HIGH",
    status: "IN_PROGRESS",
    image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    upvotesCount: 18,
    department: "Solid Waste Management Department",
    resolutionNotes: "Sanitation truck assigned. Scheduled for site clearing by 3 PM.",
  },
  {
    title: "Broken Main Pipeline Causing Severe Drinking Water Loss",
    description: "High-pressure clean water supply pipe burst under the pavement. Gallons of drinking water wasting onto the road since 6 AM today.",
    category: "Water Supply",
    location: "ITPL Main Road, Near Hope Farm, Whitefield",
    pincode: "560066",
    priority: "CRITICAL",
    status: "ACKNOWLEDGED",
    image: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80",
    upvotesCount: 31,
    department: "Municipal Water Supply & Board",
    resolutionNotes: "Emergency valve closed. Pipe replacement crew dispatched.",
  },
  {
    title: "Dead Streetlights on 14th Main for 300 Metres",
    description: "Entire stretch of 8 LED streetlamps is dark for the past week. High risk for women and evening commuters walking back from the bus stop.",
    category: "Street Lighting",
    location: "14th Main, Sector 2, HSR Layout",
    pincode: "560102",
    priority: "MEDIUM",
    status: "REPORTED",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    upvotesCount: 15,
    department: "Electricity & Street Lighting Authority",
  },
  {
    title: "Fallen Tree Branch Damaged Walking Track & Bench",
    description: "Heavy storm brought down a large banyan branch across the main jogging track. Benches crushed and path blocked.",
    category: "Parks & Public Spaces",
    location: "Central Neighborhood Park, Ward 45, Jayanagar",
    pincode: "560041",
    priority: "LOW",
    status: "RESOLVED",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    upvotesCount: 9,
    department: "Horticulture & Parks Department",
    resolutionNotes: "Tree branches cut and debris removed. Track reopened for public.",
    resolvedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    title: "Flickering Malfunctioning Traffic Signals",
    description: "Signal lights are stuck on blinking yellow causing heavy gridlock during peak hours.",
    category: "Traffic & Signals",
    location: "Silk Board Flyover Ramp, BTM 2nd Stage",
    pincode: "560068",
    priority: "HIGH",
    status: "REPORTED",
    image: "https://images.unsplash.com/photo-1508873696983-2df57046475b?auto=format&fit=crop&w=800&q=80",
    upvotesCount: 22,
    department: "Traffic Engineering & Mobility Cell",
  },
];

export const seedDatabase = async () => {
  try {
    console.log("🌱 Checking database seed...");

    const citizenCount = await Citizen.countDocuments();
    let demoCitizen;

    if (citizenCount === 0) {
      console.log("👤 Creating demo citizen account...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("demo12345", salt);

      demoCitizen = await Citizen.create({
        fullName: "Aarav Sharma",
        email: "demo@fixmycity.org",
        password: hashedPassword,
        phone: "9876543210",
        city: "Bengaluru",
      });
      console.log("✅ Demo citizen created: demo@fixmycity.org / demo12345");
    } else {
      demoCitizen = await Citizen.findOne();
    }

    const issueCount = await Issue.countDocuments();
    if (issueCount === 0) {
      console.log("📋 Seeding initial civic issues...");
      const issuesWithUser = sampleIssues.map((item) => ({
        ...item,
        reportedBy: demoCitizen._id,
        reporterName: demoCitizen.fullName,
      }));
      await Issue.insertMany(issuesWithUser);
      console.log(`✅ Seeded ${sampleIssues.length} realistic civic issues.`);
    }

    console.log("🌱 Database readiness complete.");
  } catch (error) {
    console.error("❌ Seed Error:", error.message);
  }
};

if (process.argv[1]?.endsWith("seedData.js")) {
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}
