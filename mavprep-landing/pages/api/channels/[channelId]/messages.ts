import type { NextApiRequest, NextApiResponse } from "next";
import { createMessage, getChannelMessages, type Message } from "@/lib/dynamodb";

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
        // Get messages for a channel
        const limit = parseInt(req.query.limit as string) || 50;
        const lastKey = req.query.lastKey as string | undefined;

        const messages = await getChannelMessages(channelId, limit, lastKey);
        return res.status(200).json({ messages });

      case "POST":
        // Create a new message
        const messageData: Partial<Message> = req.body;

        if (!messageData.userId || !messageData.userName || !messageData.content) {
          return res.status(400).json({ 
            error: "Missing required fields: userId, userName, content" 
          });
        }

        const newMessage = await createMessage({
          ...messageData,
          id: messageData.id || `msg-${Date.now()}`,
          channelId,
          userId: messageData.userId,
          userName: messageData.userName,
          content: messageData.content,
          timestamp: messageData.timestamp || new Date().toISOString(),
        });

        return res.status(201).json({ message: newMessage });

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Messages API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

