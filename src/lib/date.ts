import moment from "moment";

export const formatDate = (
  date: string | Date,
  format: string = "DD-MM-YYYY",
): string => {
  return moment(date).add(5.5, "hours").format(format);
};
