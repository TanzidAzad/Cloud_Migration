import type { NextApiRequest, NextApiResponse } from "next";
import { createChannel, getAllChannels } from "@/lib/dynamodb";

const DEFAULT_CHANNELS = [
  {
    id: "c-1",
    name: "Final Review",
    type: "text" as const,
    privacy: "public" as const,
    createdBy: "aroudra_thakur",
    createdAt: new Date().toISOString(),
    course: "CSE 2320 - Data Structures",
  },
  {
    id: "c-2",
    name: "Last Minute Q&A",
    type: "text" as const,
    privacy: "public" as const,
    createdBy: "aroudra_thakur",
    createdAt: new Date().toISOString(),
    course: "CSE 3318 - Algorithms",
  },
  {
    id: "c-3",
    name: "Group Study",
    type: "text" as const,
    privacy: "public" as const,
    createdBy: "aroudra_thakur",
    createdAt: new Date().toISOString(),
    course: "CSE 3320 - Operating Systems",
  },
  {
    id: "c-4",
    name: "Project Help",
    type: "text" as const,
    privacy: "public" as const,
    createdBy: "aroudra_thakur",
    createdAt: new Date().toISOString(),
    course: "CSE 3330 - Databases",
  },
  {
    id: "v-1",
    name: "Study Room A",
    type: "voice" as const,
    privacy: "public" as const,
    createdBy: "aroudra_thakur",
    createdAt: new Date().toISOString(),
    course: "General Study",
  },
  {
    id: "v-2",
    name: "Silent Focus",
    type: "voice" as const,
    privacy: "public" as const,
    createdBy: "aroudra_thakur",
    createdAt: new Date().toISOString(),
    course: "Quiet Study Zone",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { force } = req.query;

  try {
    // Check if channels already exist
    const existingChannels = await getAllChannels();
    
    if (existingChannels.length > 0 && force !== "true") {
      return res.status(200).json({ 
        message: "Channels already exist. Use ?force=true to re-seed.", 
        count: existingChannels.length,
        channels: existingChannels 
      });
    }

    // Seed the default channels
    for (const channel of DEFAULT_CHANNELS) {
      await createChannel(channel);
    }

    return res.status(201).json({ 
      message: "Channels seeded successfully", 
      count: DEFAULT_CHANNELS.length,
      channels: DEFAULT_CHANNELS 
    });
  } catch (error: unknown) {
    console.error("Error seeding channels:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "Failed to seed channels", details: errorMessage });
  }
}

