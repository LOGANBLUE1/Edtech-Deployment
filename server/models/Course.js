const mongoose = require("mongoose")
// const User = require('../models/User');
const RatingAndReview = require('./RatingandReview');
const Section = require('./Section');
const Category = require('./Category');

const coursesSchema = new mongoose.Schema({
  courseName: { 
    type: String,
    required: true,
    trim: true 
  },
  courseDescription: { 
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  whatYouWillLearn: {
    type: String,
    trim: true
  },
  courseContent: [//
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  instructions: {  
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  createdAt: { type: Date, default: Date.now },
})

coursesSchema.pre('findOneAndDelete', async function(next) {
  try {
    // Find the course that is about to be deleted
    const course = await this.model.findOne(this.getFilter());
    if (!course) return next();

    const courseId = course._id;

    // 1. Unenroll each student from the course and delete their progress
    // const [studentsEnrolled, courseProgressIds] = await Promise.all([
    //   User.find({ _id: { $in: course.studentsEnrolled } }).distinct("_id"),
    //   CourseProgress.find({ courseId }).distinct("_id"),
    // ]);
    
    // await User.updateMany(
    //   { _id: { $in: studentsEnrolled } },
    //   { $pull: { courses: courseId, courseProgress: { $in: courseProgressIds } } }
    // );
    

    // 2. Delete all ratings and reviews for the course
    await RatingAndReview.deleteMany({ course: courseId });

    // 3. Remove the course from the instructor's courses array
    // await User.findByIdAndUpdate(course.instructor, {
    //   $pull: { courses: courseId }
    // });

    // 4. Delete sections and their sub-sections
    for (const sectionId of course.courseContent) {
      // sub section cascading will be taken care by pre-delete hook
      await Section.findByIdAndDelete(sectionId);
    }

    // 5. Remove the course from its category
    await Category.findByIdAndUpdate(course.category, {
      $pull: { courses: courseId }
    });

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Course", coursesSchema)
