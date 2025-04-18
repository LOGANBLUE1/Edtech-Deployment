const mongoose = require("mongoose");
const Profile = require("../models/Profile")
const CourseProgress = require("../models/CourseProgress")

const Course = require("../models/Course")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const convertSecondsToDuration = require("../utils/secToDuration")

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, about, contactNumber, gender } = req.body;
    const id = req.user.id;

    // Find the user by id
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the profile associated with the user
    const profile = await Profile.findById(userDetails.additionalDetails);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found for this user",
      });
    }

    if (firstName !== undefined) userDetails.firstName = firstName;
    if (lastName !== undefined) userDetails.lastName = lastName;

    await userDetails.save();

    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (about !== undefined) profile.about = about;
    if (contactNumber !== undefined) profile.contactNumber = contactNumber;
    if (gender !== undefined) profile.gender = gender;
    await profile.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};



exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id
    // console.log("Printing id to be deleted: ",id)
    const user = await User.findById({ _id: id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // makes user inactive
    user.active = false
    user.courseProgress = []
    await user.save()
    
    // deletes course progress of user
    await CourseProgress.deleteMany({ userId: id })

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ 
      success: false, 
      message: "User Cannot be deleted successfully" 
    })
  }
}

exports.getCompleteUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()
    // console.log(userDetails)
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files?.displayPicture
    if(!displayPicture){
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      })
    }
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    userDetails = userDetails.toObject()


    let SubsectionLength = 0
    for (let i = 0; i < userDetails.courses.length; i++) {//All courses
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {//All sections
        totalDurationInSeconds += userDetails.courses[i].courseContent[j]
          .subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseId: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const precision = 2;
        const progressPercentage = (courseProgressCount / SubsectionLength) * 100;
        userDetails.courses[i].progressPercentage = parseFloat(progressPercentage.toFixed(precision));
      }
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ 
      success: true,
      data: courseData
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

exports.deleteUserPermanently = async (req, res) => {
  try {
    const {field} = req.body
    if (!field) {
      return res.status(400).json({
        success: false,
        message: "User ID or email is required",
      });
    }
    
    let user;
    if (mongoose.Types.ObjectId.isValid(field))
      user = await User.findById(field);
    if(!user)
      user = await User.findOne({ email: field });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    await User.findOneAndDelete({ _id: user._id });
    // The middleware takes care of cascading deletes for you.

    res.status(200).json({
      success: true,
      email: user.email,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ 
      success: false, 
      message: "User Cannot be deleted successfully" 
    })
  }
}