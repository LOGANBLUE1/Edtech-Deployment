import { useSelector } from "react-redux"
import CTAButton from "../../../core/HomePage/Button"
import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart)
  const { paymentLoading } = useSelector((state) => state.course)

  if (paymentLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner"></div>
      </div>
    )

  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">Cart</h1>
      <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
        {totalItems} Courses in Cart
      </p>
      {totalItems > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <div className="flex flex-col items-center text-richblack-100 gap-2">
          <p className="mt-14 text-center text-3xl">
            Your cart is empty
          </p>
          <CTAButton active={false} linkto={"/catalog/all"} className>
            <div className="text-xl">+</div>
          </CTAButton>
        </div>
      )}
    </>
  )
}
