import type { NextApiRequest, NextApiResponse } from "next";
import { createChannel, getAllChannels, type Channel } from "@/lib/dynamodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        // Get all channels
        const channels = await getAllChannels();
        return res.status(200).json({ channels });

      case "POST":
        // Create a new channel
        const channelData: Channel = req.body;
        
        if (!channelData.id || !channelData.name || !channelData.type) {
          return res.status(400).json({ error: "Missing required fields: id, name, type" });
        }

        await createChannel(channelData);
        return res.status(201).json({ message: "Channel created", channel: channelData });

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Channel API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

