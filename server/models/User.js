const mongoose = require("mongoose")
const Profile = require('./Profile');
const CourseProgress = require('./CourseProgress');
const RatingandReview = require('./RatingAndReview');
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
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },
    active: {                          //disable it instead of deleting account
      type: Boolean,
      default: true,
    },
    approved: {                        //???
      type: Boolean,
      default: true,
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
    token: {                           
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

      await RatingandReview.deleteMany({ user: user._id });

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
