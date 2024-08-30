export const formatDate = (datePaid: string | number | Date) => {
  if (datePaid) {
    const date = new Date(datePaid);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDate = `${month}-${day}-${year} ${hours}:${minutes}`;
    return formattedDate;
  }
};
