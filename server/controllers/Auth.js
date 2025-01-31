const bcrypt = require("bcrypt")
const User = require("../models/User")
const OTP = require("../models/OTP")
const CourseProgress = require("../models/CourseProgress")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const Profile = require("../models/Profile")
require("dotenv").config()

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email,
      password, confirmPassword, accountType, otp } = req.body;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long and include one number, one lowercase letter, one uppercase letter, and one special character."
      });
    }

    
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match. Please try again."
      });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue."
      });
    }

    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "The OTP did not found"
      });
    } 

    else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid"
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null
    })

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      active:true,
      approved:false,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user
    });
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again."
    });
  }
}



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`
      });
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`
      })
    }

    if (await bcrypt.compare(password, user.password)) {
      // check if user is inactive
      if (!user.active) {
        if (Date.now() - new Date(user.updatedAt).getTime() > 30 * 24 * 60 * 60 * 1000) {
          return res.status(401).json({
            success: false,
            message: `User is Inactive for more than 30 days. Please contact Admin`
          });
        }
        else{
          //reactivate again
          user.active = true;
          //create course progress for all courses
          const courseProgressIds = await Promise.all(
            user.courses.map(async (course) => {
              const courseProgress = await CourseProgress.create({
                userId: user._id,
                courseId: course._id,
                completedVideos: [],
              });
              return courseProgress._id;
            })
          )
          user.courseProgress = courseProgressIds;
          await user.save();
        }
      }

      const payload = { email: user.email, id: user._id, accountType: user.accountType };
      const token = jwt.sign( payload,
          process.env.JWT_SECRET,
          {expiresIn: "24h"}
      );
    
      //creating cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),// 3 days
        httpOnly: true
        // sameSite: 'Strict'
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`
      });

    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`
      });
    }
  } catch (error) {
    console.error('Failed to login ', error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`
    });
  }
}

exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    // Basic email validation (optional)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    const checkUserPresent = await User.findOne({ email })
    
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    let otp;
    let result;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    } while (result);

    //for storing in db
    const otpBody = await OTP.create({ email, otp });

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp
    });
  } catch (error) {
    console.log("Problem with otp sending", error.message)
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}


exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id)

    const { oldPassword, newPassword } = req.body
    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )

    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "The password is incorrect" 
      })
    }

    if(oldPassword === newPassword){
      return res.status(401).json({ 
        success: false, 
        message: "The password is same as old password" 
      })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long and include one number, one lowercase letter, one uppercase letter, and one special character."
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
        const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      // console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    return res.status(200).json({ 
      success: true, 
      message: "Password updated successfully" 
    })
  } catch (error) {
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}

// no use in front-end ******************
exports.getAllEmails = async (req, res) => {
  try {
    let Emails = await User.find().select("email")
    // Emails = Emails.map(email => email.email);// to get array of emails
    if (Emails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Emails not found",
      })
    }
    res.status(200).json({
      success: true,
      Emails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}