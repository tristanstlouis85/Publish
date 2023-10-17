import { getYearDates } from "../../../helpers/common_helper";

/** Dates */
const currentDate = new Date();
const yearDates = getYearDates(currentDate);
const preStartDate = yearDates.previousYear.startDate;
const preEndDate = yearDates.previousYear.endDate;
const currentStartDate = yearDates.currentYear.startDate;
const currentEndDate = yearDates.currentYear.endDate;

/** YTD */
const currentYearStart = new Date(currentStartDate).toISOString();
const currentYearEnd = new Date(currentEndDate).toISOString();
const previousYearStart = new Date(preStartDate).toISOString();
const previousYearEnd = new Date(preEndDate).toISOString();

export {
    currentYearStart,
    currentYearEnd,
    previousYearStart,
    previousYearEnd
};