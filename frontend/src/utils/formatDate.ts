export const formatDate = (datetime: string | number | Date) => {
    const date = new Date(datetime);
    const formattedDateTime = date
      .toISOString()
      .replace("T", " ")
      .split(".")[0];
    return formattedDateTime;
  };