import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { ErrorHandler } from "../middleware/error.js";
import { User } from "../models/user.schema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/generateToken.js";

// ----- REGISTER USER ----- //
const registerUser = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    next(new ErrorHandler("Avatar And Resume are Required!", 400));
  }
  const { avatar, resume } = req.files;
  const cloudinaryAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: "AVATARS" }
  );
  if (!cloudinaryAvatar || cloudinaryAvatar.error) {
    console.error(
      "Cloudinary Avatar Error: ",
      cloudinaryAvatar.error || "Unknown Avatar Error"
    );
  }
  const cloudinaryResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    { folder: "RESUME" }
  );
  if (!cloudinaryResume || cloudinaryResume.error) {
    console.error(
      "Cloudinary Resume Error: ",
      cloudinaryResume.error || "Unknown Resume Error"
    );
  }

  const {
    fullName,
    email,
    aboutMe,
    password,
    phone,
    portfolioURL,
    githubURL,
    instagramURL,
    facebookURL,
    linkedInURL,
  } = req.body;
  if (
    !fullName &&
    !email &&
    !aboutMe &&
    !password &&
    !phone &&
    !portfolioURL &&
    !githubURL &&
    !instagramURL &&
    !facebookURL &&
    !linkedInURL
  ) {
    next(new ErrorHandler("All Fileds Are Required!", 400));
  }
  const user = await User.create({
    fullName,
    email,
    aboutMe,
    password,
    phone,
    portfolioURL,
    githubURL,
    instagramURL,
    facebookURL,
    linkedInURL,
    avatar: {
      public_Id: cloudinaryAvatar.public_id,
      url: cloudinaryAvatar.secure_url,
    },
    resume: {
      public_Id: cloudinaryResume.public_id,
      url: cloudinaryResume.secure_url,
    },
  });
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createUser) {
    throw new ApiError(500, "Internal server Error");
  }
  generateToken(user, "User Create SuccessFully", 200, res);
});

// ----- Login User ----- //
const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email || password)) {
    next(new ErrorHandler("All Fileds Are Required!", 400));
  }
  const user = await User.findOne({ email }).select("-password -refreshToken");
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Password", 400));
  }
  generateToken(user, "User Login SuccessFully", 200, res);
});

export { registerUser, loginUser };
