import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Address = mongoose.Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String,  },
    Email: { type: String, required: true },
    PhoneNo: { type: String, required: true },
    Address1: { type: String, required: true },
    Address2: { type: String, },
    City: { type: String, required: true },
    Country: { type: String, required: true },
    State: { type: String, required: true },
    Zip: { type: String, required: true },
  }
  // ,
  // {
  //   timestamps: true,
  // }
);
const paymentMethods = mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
  },
  expiryMonth: {
    type: String,
    required: true,
  },
  expiryYear: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    userType: {
      type: String,
      required: true,
      default: "customer",
    },
    dob: {
      type: String,
      required: false,
    },
    companyName: {
      type: String,
      required: false,
    },
    companyName: {
      type: String,
      required: false,
    },
    companyRegNo: {
      type: String,
      required: false,
    },
    companyEmail: {
      type: String,
      required: false,
    },
    companyAddress: {
      type: Object,
      required: false,
    },
    signinType: {
      type: String,
      required: true,
      default: "default",
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    addresses: [Address],
    paymentMethods: [paymentMethods],
    stripeId: {
      type: String,
    },
    stripeCompanyAccountId: {
      type: String,
    },
    profilePic: {
      type: String,
      required: true,
      default: '/assets/img/logo.png'
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
