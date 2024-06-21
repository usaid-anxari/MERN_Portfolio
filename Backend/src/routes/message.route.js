import { Router } from "express";
import { deleteMessage, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.route('/sent-message').post(sendMessage)
router.route('/get-messages').get(getMessages)
router.route('/delete-message/:id').delete(deleteMessage)

export default router