const bcrypt = require("bcrypt")
const User = require("../models/User")
const OTP = require("../models/OTP")
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
    // const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    // console.log("Recent otp: ",recentOtp)

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

    // Create the user
    let approved;
    // approved = approved === "Instructor" ? false : true;  //  ??????????????????????
    // let approved = ""
    // approved = accountType === "Instructor" ? false : true;

    // Create the Additional Profile For User
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
      accountType: accountType,
      approved: approved,
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

    // Find user with provided email
    const user = await User.findOne({ email })

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`
      })
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {

      const payload = { email: user.email, id: user._id, role: user.accountType };
      const token = jwt.sign( payload,
          process.env.JWT_SECRET,
          {expiresIn: "24h"}
      );

      // Save token to user document in database
      user.token = token;
      // await user.save(); ** 
      user.password = undefined;   // returning empty pass in response
    

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


// checks if email is already registered and if not then creates and store otp in db
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    // // Basic email validation (optional)
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!email || !emailRegex.test(email)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Invalid email address',
    //   });
    // }

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

    // const otpPayload = { email, otp };//for storing in db
    const otpBody = await OTP.create({ email, otp });
    console.log("OTP Body", otpBody)

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp
    });
  } catch (error) {
    console.log("Problem with otp sending ", error.message)
    return res.status(500).json({
      success: false,
      error: error.message 
    });
  }
}


exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body***
    // conf newPass ??????????????????????????????
    const { oldPassword, newPassword } = req.body
    console.log(oldPassword, newPassword);
    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )

    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
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
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
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