import type { NextApiRequest, NextApiResponse } from "next";
import { getChannel, deleteChannel } from "@/lib/dynamodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { channelId } = req.query;

  if (!channelId || typeof channelId !== "string") {
    return res.status(400).json({ error: "Channel ID is required" });
  }

  try {
    switch (req.method) {
      case "GET":
        // Get single channel
        const channel = await getChannel(channelId);
        if (!channel) {
          return res.status(404).json({ error: "Channel not found" });
        }
        return res.status(200).json({ channel });

      case "DELETE":
        // Delete channel and all its messages
        await deleteChannel(channelId);
        return res.status(200).json({ message: "Channel deleted" });

      default:
        res.setHeader("Allow", ["GET", "DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Channel API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

