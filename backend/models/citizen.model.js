import mongoose from "mongoose";

const citizenSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    city: {
      type: String,
      default: "Metro City",
      trim: true,
    },
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
    upvotedIssues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
    role: {
      type: String,
      enum: ["CITIZEN", "OFFICIAL", "ADMIN"],
      default: "CITIZEN",
    },
  },
  { timestamps: true }
);

// Method to safely return citizen data without password
citizenSchema.methods.toJSON = function () {
  const citizenObject = this.toObject();
  delete citizenObject.password;
  return citizenObject;
};

const Citizen = mongoose.model("Citizen", citizenSchema);
export default Citizen;
