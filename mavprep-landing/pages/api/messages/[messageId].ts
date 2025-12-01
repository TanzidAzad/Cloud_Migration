import type { NextApiRequest, NextApiResponse } from "next";
import { updateMessage, deleteMessage } from "@/lib/dynamodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messageId } = req.query;

  if (!messageId || typeof messageId !== "string") {
    return res.status(400).json({ error: "Message ID is required" });
  }

  try {
    switch (req.method) {
      case "PUT":
        // Update a message
        const { channelId, timestamp, content } = req.body;

        if (!channelId || !timestamp || !content) {
          return res.status(400).json({ 
            error: "Missing required fields: channelId, timestamp, content" 
          });
        }

        await updateMessage(channelId, messageId, timestamp, content);
        return res.status(200).json({ message: "Message updated" });

      case "DELETE":
        // Delete a message
        const { channelId: deleteChannelId, timestamp: deleteTimestamp } = req.body;

        if (!deleteChannelId || !deleteTimestamp) {
          return res.status(400).json({ 
            error: "Missing required fields: channelId, timestamp" 
          });
        }

        await deleteMessage(deleteChannelId, messageId, deleteTimestamp);
        return res.status(200).json({ message: "Message deleted" });

      default:
        res.setHeader("Allow", ["PUT", "DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Message API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

