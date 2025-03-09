import { toast } from "react-hot-toast"

import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"
import { HTTP_METHODS } from "../../utils/constants"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

// Load the Razorpay SDK from the CDN
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Buy the Course
export async function BuyCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...")
  try {
    // Loading the script of Razorpay SDK
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      toast.error("Razorpay SDK failed to load. Check your Internet Connection.")
      return
    }

    // Initiating the Order in Backend
    const orderResponse = await apiConnector(HTTP_METHODS.POST,
      COURSE_PAYMENT_API, 
      {courses},
      { Authorization: `Bearer ${token}`}
    )

    if (!orderResponse.success) {
      throw new Error(orderResponse.message)
    }
    console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse)

    // Opening the Razorpay SDK
    const options = {
      key: process.env.RAZORPAY_KEY,
      currency: orderResponse.currency,
      amount: `${orderResponse.amount}`,
      order_id: orderResponse.id,
      name: "StudyNotion",
      description: "Thank you for Purchasing the Course.",
      image: rzpLogo,
      prefill: {
        name: `${user_details.firstName} ${user_details.lastName}`,
        email: user_details.email,
      },
      handler: function (response) {
        sendPaymentSuccessEmail(response, orderResponse.data.amount, token)
        verifyPayment({ ...response, courses }, token, navigate, dispatch)
      },
    }
    const paymentObject = new window.Razorpay(options)

    paymentObject.open()
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.")
      console.log(response.error)
    })
  } catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error("Could Not make Payment.")
  }
  toast.dismiss(toastId)
}

export async function BuyFreeCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...")
  try {
    // Initiating the Order in Backend
    const orderResponse = await apiConnector(HTTP_METHODS.POST,
      COURSE_PAYMENT_API, 
      {courses},
      { Authorization: `Bearer ${token}`}
    )

    if (!orderResponse.success) {
      throw new Error(orderResponse.message)
    }
    // console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse)
    const mockResponse = {
      razorpay_payment_id: "pay_" + Math.random().toString(36).substring(2, 15), // Random payment ID
      razorpay_order_id: "order_" + Math.random().toString(36).substring(2, 15), // Random order ID
      razorpay_signature: Math.random().toString(36).substring(2, 15), // Random signature
    };

    sendPaymentSuccessEmail(mockResponse, orderResponse.amount, token)
    verifyPayment({...mockResponse ,courses }, token, navigate, dispatch)
      
  } catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error("Could Not make Payment.")
  }
  toast.dismiss(toastId)
}

// Verify the Payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...")
  dispatch(setPaymentLoading(true))
  try {
    const response = await apiConnector(HTTP_METHODS.POST, 
      COURSE_VERIFY_API, 
      bodyData, 
      { Authorization: `Bearer ${token}`}
    )

    // console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

    if (!response.success) {
      throw new Error(response.message)
    }

    toast.success("Payment Successful. You are Added to the course ")
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error)
    toast.error("Could Not Verify Payment.")
  }
  toast.dismiss(toastId)
  dispatch(setPaymentLoading(false))
}

// Send the Payment Success Email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(HTTP_METHODS.POST,
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      { Authorization: `Bearer ${token}` }
    )
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
  }
}
