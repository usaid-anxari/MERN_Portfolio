import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    senderName: {
      type: String,
      required: true,
      minLength: [2, "Name must contain at least 3 charachters!"],
    },
    subject: {
      type: String,
      required: true,
      minLength: [2, "Subject must contain at least 3 charachters!"],
    },
    message: {
      type: String,
      required: true,
      minLength: [2, "Message must contain at least 3 charachters!"],
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Messages", messageSchema);