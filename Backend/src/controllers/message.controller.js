import { Message } from "../models/message.model.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { ErrorHandler } from "../middleware/error.js";


// ----- SEND MESSAGE ----- //
const sendMessage = catchAsyncError(async (req, res, next) => {
  const { senderName, subject, message } = req.body;
  if (!(senderName || subject || message)) {
    return next(new ErrorHandler("Please Full Fill Form",400))
  }
  const data = await Message.create({senderName,subject,message})
  res.status(201).json({
    success: true,
    message: "Message Sent Successfully",
    data,
  });
});

// ----- GET MESSAGES ----- //
const getMessages = catchAsyncError(async(req,res,next)=>{
  const data = await Message.find()
  res.status(200).json({
    success: true,
    data,
  });
})

// ----- DELETE MESSAGE ----- //
const deleteMessage = catchAsyncError(async(req,res,next)=>{
  const {id} = req.params
  const data = await Message.findOne({id})
  if(!data){
    return next(new ErrorHandler("Message Not Found",404))
  }
  await data.deleteOne();
  res.status(200).json({
    success: true,
    message: "Message Deleted Successfully",
    data,
  });
})

export {sendMessage,getMessages,deleteMessage}