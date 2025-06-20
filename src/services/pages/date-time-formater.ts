export function formateDateTime(cellDateTime: string, hoursFormat: string) {
  // Ensure cellDateTime is a string (e.g., "2024-02-20T00:00:00.000Z")
  const cellDateTimeStr = String(cellDateTime);

  // Split into date and time parts
  const datePart = cellDateTimeStr.split("T")[0]; // "2024-02-20"
  const timePart = cellDateTimeStr.split("T")[1].split(".")[0]; // "00:00:00"

  // Extract date components
  const [year, month, day] = datePart.split("-");
  // Extract time components
  const [hours, minutes, seconds] = timePart.split(":");

  // Convert to 12-hour format with AM/PM if required
  let formattedHours = hours;
  let ampm = "";
  if (hoursFormat === "12-hour") {
    let hour12 = parseInt(hours, 10);
    ampm = hour12 >= 12 ? "PM" : "AM";
    hour12 = hour12 % 12 || 12; // Convert 0 to 12 for midnight/noon
    formattedHours = hour12.toString();
  }

  // Format the output: "DD/MM/YYYY hh:mm:ss A"
  const formattedDate = `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year} ${formattedHours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")} ${ampm}`;

  return formattedDate;
}
