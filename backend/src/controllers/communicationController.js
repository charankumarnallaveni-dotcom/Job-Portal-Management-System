import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const messages = asyncHandler(async (req, res) => {
  const rows = await query(
    `SELECT * FROM messages
     WHERE (sender_id=:me AND receiver_id=:peer) OR (sender_id=:peer AND receiver_id=:me)
     ORDER BY created_at ASC`,
    { me: req.user.id, peer: req.params.peerId }
  );
  await query("UPDATE messages SET read_at = NOW() WHERE sender_id=:peer AND receiver_id=:me AND read_at IS NULL", {
    me: req.user.id,
    peer: req.params.peerId
  });
  res.json({ success: true, data: rows });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const result = await query(
    "INSERT INTO messages (sender_id, receiver_id, body) VALUES (:senderId, :receiverId, :body)",
    { senderId: req.user.id, receiverId: req.params.peerId, body: req.body.body }
  );
  res.status(201).json({ success: true, id: result.insertId });
});

export const notifications = asyncHandler(async (req, res) => {
  const rows = await query("SELECT * FROM notifications WHERE user_id = :id ORDER BY created_at DESC", { id: req.user.id });
  res.json({ success: true, data: rows });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  await query("UPDATE notifications SET read_at = NOW() WHERE id = :id AND user_id = :userId", {
    id: req.params.id,
    userId: req.user.id
  });
  res.json({ success: true });
});
