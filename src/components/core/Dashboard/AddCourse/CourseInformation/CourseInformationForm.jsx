import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  addCourseDetails,
  editCourseDetails,
} from "../../../../../services/operations/courseDetailsAPI"
import { getAllCategories } from "../../../../../services/operations/pageAndComponentDatas"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../Common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementsField"

export default function CourseInformationForm({course}) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()
  
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  // only for editing course
  const { editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])
  const [courseFree, setCourseFree] = useState(false);
  const handleToggle = () => {
    setCourseFree((prev) => !prev);
    if (!courseFree) {
      setValue("coursePrice", "0");
    }
  };

  useEffect(() => {
    if (editCourse && courseCategories.length > 0) {
      setValue("courseCategory", course.category._id)
    }
  }, [editCourse, courseCategories]);

  useEffect(() => {
    //self invoking async function
    (async () => {
      setLoading(true)
      const categories = await getAllCategories()
      if (categories.length > 0) {
        setCourseCategories(categories)
      }
      setLoading(false)
    })();

    if (editCourse) {
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }
  }, [])// on first render set the values from the

  const isFormUpdated = () => {
    const currentValues = getValues()

    return (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory !== course.category._id ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail ||
      currentValues.courseFree !== course.courseFree
    )
  }

  //   handle next button click
  const onSubmit = async (data) => {
      if (editCourse) {
          if (isFormUpdated()) {
              const currentValues = getValues()
              const formData = new FormData()
              formData.append("courseId", course._id)
              if (currentValues.courseTitle !== course.courseName) {
                formData.append("courseName", data.courseTitle)
              }
              if (currentValues.courseShortDesc !== course.courseDescription) {
                formData.append("courseDescription", data.courseShortDesc)
              }
              if (currentValues.coursePrice !== course.price) {
                formData.append("price", data.coursePrice)
              }
              if (currentValues.courseTags.toString() !== course.tag.toString()) {
                formData.append("tag", JSON.stringify(data.courseTags))
              }
              if (currentValues.courseBenefits !== course.whatYouWillLearn) {
                formData.append("whatYouWillLearn", data.courseBenefits)
              }
              if (currentValues.courseCategory !== course.category._id) {
                formData.append("category", data.courseCategory)
              }
              if (
                currentValues.courseRequirements.toString() !==
                course.instructions.toString()
              ) {
                formData.append(
                  "instructions",
                  JSON.stringify(data.courseRequirements)
                )
              }
              if (currentValues.courseImage !== course.thumbnail) {
                formData.append("thumbnailImage", data.courseImage)
              }
              ////
              // console.log("Form Data being sent to edit course:");
              // for(const [key, value] of formData.entries()) {
              //   console.log(`${key}: ${value}`);
              // }
              setLoading(true)
              const result = await editCourseDetails(formData, token)
              setLoading(false)
              if (result) {
                dispatch(setStep(2))
                dispatch(setCourse(result))
              }
          } else {
              toast.error("No changes made to the form")
          }
          return
      }

      const formData = new FormData()
      formData.append("courseName", data.courseTitle)
      formData.append("courseDescription", data.courseShortDesc)
      formData.append("price", data.coursePrice)
      formData.append("tag", JSON.stringify(data.courseTags))
      formData.append("whatYouWillLearn", data.courseBenefits)
      formData.append("category", data.courseCategory)
      formData.append("status", COURSE_STATUS.DRAFT)
      formData.append("instructions", JSON.stringify(data.courseRequirements))
      formData.append("thumbnailImage", data.courseImage);

      setLoading(true)
      const result = await addCourseDetails(formData, token)
      if (result) {
        dispatch(setStep(2))
        dispatch(setCourse(result))
      }
      setLoading(false)
  }




  return (
    <form
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>
      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>

      <div className="flex items-center mb-4">
        <label className="text-sm text-richblack-5 mr-2">Course Free:</label>
        <div
          className={`relative w-12 h-6 rounded-full cursor-pointer ${
            courseFree ? "bg-green-500" : "bg-gray-400"
          }`}
          onClick={() => handleToggle()}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
              courseFree ? "transform translate-x-6" : ""
            }`}
          ></div>
        </div>
      </div>

      {/* Course Price */}
      { !courseFree && <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="coursePrice">
            Course Price <sup className="text-pink-200">*</sup>
          </label>
          <div className="relative">
            <input
              id="coursePrice"
              placeholder="Enter Course Price"
              {...register("coursePrice", {
                required: true,
                valueAsNumber: true,
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                },
              })}
              className="form-style w-full !pl-12"
            />
            <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
          </div>
          {errors.coursePrice && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Price is required
            </span>
          )}
        </div>
      }

      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          id="courseCategory"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, idx) => (
              <option key={idx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editMode={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>
      
      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Without Saving
          </button>
        )}
        <IconBtn 
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
          onclick={handleSubmit(onSubmit)}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}
