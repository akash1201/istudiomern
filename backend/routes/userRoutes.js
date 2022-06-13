import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  StripeAccountLink,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  updateUserAddress,
  deleteUserAddress,
  resetPassword,
  getUserByEmail,
  addCard,
  getCardById,
  deleteCard,
  updateCard,
  getAllCard,
  verifyEmail,
  getVendor,
  vendorRegis,
  vendorDetails,
  stripeConnect,
  resendVerification,
  updateProfileImage,
  getStoreName
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
router.route("/getStripeAccountLink").post(protect, StripeAccountLink);
router.route("/vendorRegis").put(protect, vendorRegis);
router.route("/vendorDetails/:id").get(protect, vendorDetails);
router.route("/").post(registerUser).get(protect, admin, getUsers);
router.route("/vendors").get(protect, admin, getVendor);
router.route("/vendor/store-name/:vendorId").get(getStoreName);
router.route("/reset/:id").put(resetPassword);
router.route("/verify-email/:id").put(verifyEmail);
router.route("/reset/:email").get(getUserByEmail);
//router.route('/addresses').post(protect,admin,createUserAddress)
router.route("/:id/addresses").put(protect, updateUserAddress);
router.route("/:id/addresses").delete(protect, deleteUserAddress);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

router
  .route("/paymentMethods/:id/:methodId")
  .get(getCardById)
  .put(updateCard)
  .delete(deleteCard);

router.route("/paymentMethods/:id").get(getAllCard).post(addCard)
router.route("/stripe-connect/:id").get(protect, stripeConnect)
router.route("/resend-verification").post(protect, resendVerification)
router.route("/update-profile-pic/:id").put(protect, updateProfileImage)

export default router;
