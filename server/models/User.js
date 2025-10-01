const mongoose = require("mongoose")
const Profile = require('./Profile');
const { ACCOUNT_TYPE, AUTH_TYPE } = require("../utils/constants");
const CourseProgress = require('./CourseProgress');
const RatingAndReview = require('./RatingandReview');
const Course = require('./Course');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    authMethods: [{
      type: String,
      enum: [AUTH_TYPE.DIRECT, AUTH_TYPE.GOOGLE, AUTH_TYPE.GITHUB],
      default: []
    }],
    password: {
      type: String
    },
    accountType: {
      type: String,
      enum: [ACCOUNT_TYPE.ADMIN, ACCOUNT_TYPE.STUDENT, ACCOUNT_TYPE.INSTRUCTOR],
      default: ACCOUNT_TYPE.STUDENT,
    },
    active: {                          //disable it instead of deleting account
      type: Boolean,
      default: true,
    },
    approved: {                        //???
      type: Boolean,
      default: false,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    token: {    // for reset password
      type: String,
    },
    resetPasswordExpires: {                 //token expiry time
      type: Date,
    },
    image: {
      type: String,
    },
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseProgress",
      },
    ],
    // Add timestamps for when the document is created and last modified
  },
  { timestamps: true }
)

userSchema.pre('findOneAndDelete', async function (next) {
  try {
    // 'this' refers to the current query.
    const user = await this.model.findOne(this.getFilter());
    if (user) {
      await Profile.findByIdAndDelete(user.additionalDetails);

      await CourseProgress.deleteMany({ userId: user._id });

      await RatingAndReview.deleteMany({ user: user._id });

      // Update courses by removing the user from studentsEnrolled
      await Course.updateMany(
        { studentsEnrolled: user._id },
        { $pull: { studentsEnrolled: user._id } }
      );
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
