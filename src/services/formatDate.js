export const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" }
  const formattedDate = date.toLocaleDateString("en-US", options)

  const hour = date.getHours()
  const minutes = date.getMinutes()
  const period = hour >= 12 ? "PM" : "AM"
  const formattedTime = `${hour % 12}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`

  return `${formattedDate} | ${formattedTime}`
}

//      2024-08-13T05:49:03.073Z  ----->   August 13, 2024 | 11:19 AM