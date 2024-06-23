import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: [2, "Name must contain at least 3 charachters!"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    aboutMe: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must contain at least 6 charachters!"],
      select: false,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      minLength: [10, "Phone must contain at least 10 charachters!"],
      maxLength: [10, "Phone must contain at most 10 charachters!"],
    },
    avatar: {
      public_Id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    resume: {
      public_Id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    portfolioURL: {
      type: String,
      required: [true, "Portfolio URL Is Required"],
    },
    githubURL: String,
    instagramURL: String,
    facebookURL: String,
    linkedInURL: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// ----- Password To Hash ----- //
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

// ----- Compare Password ----- //
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

// ----- Generate JWT ----- //
userSchema.methods.generateJsownWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_KEY,
  });
};

export const User = mongoose.model("User", userSchema);
