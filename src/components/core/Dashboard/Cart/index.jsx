import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
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
      {total > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mt-14 text-center text-3xl text-richblack-100">
            Your cart is empty
          </p>
          <Link to={`/catalog/all`}
            className="rounded-lg bg-transparent p-2 text-richblack-100 hover:bg-richblack-50">
              <p>Add</p>
          </Link>
        </div>
      )}
    </>
  )
}
