// const redisClient = require('../config/redis');
const Category = require("../models/Category")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name || !description) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required"
      });
    }

    const existingCategory = await Category.findOne({ name: name });

    if (!existingCategory) {
      const CategoryDetails = await Category.create({
        name: name,
        description: description,
      });
      return res.status(200).json({
        success: true,
        CategoryDetails,
        message: "Categorys Created Successfully",
      })
    } else {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }
    
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    })
  }
}

exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find()
    res.status(200).json({
      success: true,
      data: allCategorys,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// exports.showAllCategories = async (req, res) => {
//   try {
//     if (!redisClient.isOpen) {
//       await redisClient.connect();
//     }

//     const cachedCategories = await redisClient.get('showAllCategories');
    
//     // if found in redis cache, return the data
//     if (cachedCategories) {
//       return res.status(200).json({
//         success: true,
//         data: JSON.parse(cachedCategories),
//       });
//     }

//     await redisClient.set('showAllCategories', JSON.stringify(allCategories), {
//       EX: 3600,
//     });

//     const allCategories = await Category.find();
//     if (!allCategories) {
//       return res.status(404).json({
//         success: false,
//         message: "No categories found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: allCategories,
//     });

//   } catch (error) {
//     // Catch any errors and return a 500 response
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };


exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    // Get courses for the specified category
    let selectedCategory = 'all'
    if(categoryId !== 'all'){
      selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: [
            { path: "instructor" },
            { path: "ratingAndReviews" }
          ]
        })
        .exec()
    }

    // console.log("SELECTED COURSE", selectedCategory)
    
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res.status(404).json({ 
        success: false,
        message: "Category not found"
      })
    }

    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "instructor" },
          { path: "ratingAndReviews" }
        ]
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)
    
    if(categoryId === 'all'){
      const selectedCategory = await Category.findOne(
        allCategories[getRandomInt(allCategories.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: [
            { path: "instructor" },
            { path: "ratingAndReviews" }
          ]
        })
        .exec()

        res.status(200).json({
          success: true,
          data: {
            selectedCategory,
            mostSellingCourses
          },
          message: "All Category page details fetched successfully.",
        })
    }
    else{
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })

      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: [
            { path: "instructor" },
            { path: "ratingAndReviews" }
          ]
        })
        .exec()

        // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        return res.status(200).json({
          success: true,
          data: {
            selectedCategory,
            differentCategory,
            mostSellingCourses,
          },
          message: "No courses found for the selected category.",
        })
      }

      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
        message: "Category page details fetched successfully.",
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.getCategoryCourses = async (req, res) => {
  try {
    const { categoryId } = req.body

    const category = await Category.findById(categoryId)
    .populate({
      path: "courses",
      match: { status: "Published" },
      populate: [
        { path: "instructor" },
        { path: "ratingAndReviews" }
      ]
    })
    .exec()

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category.courses.length === 0) {
      return res.status(200).json({
        success: true,
        name: category.name,
        courses: [],
        message: "No courses found for the selected category.",
      });
    }

    return res.status(200).json({
      success: true,
      name: category.name,
      courses: category.courses,
      message: "Courses fetched successfully for the selected category.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
