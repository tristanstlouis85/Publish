function getPreviousMonthStartEndDate() {
  var currentDate = new Date();
  // Get the year and month of the current date
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth();
  // Calculate the year and month for the previous month
  var previousMonthYear = currentYear;
  var previousMonth = currentMonth - 1;

  // If the current month is January, adjust the year and month accordingly
  if (previousMonth === -1) {
      previousMonthYear -= 1;
      previousMonth = 11; // December
  }
  // Create a new date for the first day of the previous month
  var startDate = new Date(previousMonthYear, previousMonth, 1);
  // Get the last day of the previous month by setting the day to 0 of the current month
  var endDate = new Date(currentYear, currentMonth, 0);
  return { startDate : startDate , endDate : endDate}
  }
  function getCurrentMonthStartDate() {
      var currentDate = new Date();
  // Get the year and month of the current date
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth();
  // Create a new date for the first day of the month
  return new Date(year, month, 1);
}
function getPreviousNthDate(nthDate){
  let date = new Date();
  return new Date(date.setDate(date.getDate() - nthDate))
}
function dateToYmd(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
  
  function getPreviousQuarterStartDate(date) {
    const currentQuarter = Math.floor((date.getMonth() + 3) / 3);
    const previousQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
    
    const year = date.getFullYear();
    const month = (previousQuarter - 1) * 3;
    
    return new Date(year, month, 1);
  }
  
  function getQuarterDates(date,convertToYmd = 1) {
    const year = date.getFullYear();
    const quarter = Math.floor((date.getMonth() + 3) / 3);
  
    const currentQuarterStartDate = new Date(year, 3 * quarter - 3, 1);
    const currentQuarterEndDate = new Date(year, 3 * quarter, 0);
  
    const previousQuarterStartDate = getPreviousQuarterStartDate(date);
    const previousQuarterEndDate = new Date(year, 3 * (quarter - 1), 0);
  
    return {
      currentQuarter: {
        startDate: (convertToYmd) ? dateToYmd(currentQuarterStartDate) : currentQuarterStartDate,
        endDate: (convertToYmd) ? dateToYmd(currentQuarterEndDate) : currentQuarterEndDate,
      },
      previousQuarter: {
        startDate: (convertToYmd) ? dateToYmd(previousQuarterStartDate) : previousQuarterStartDate,
        endDate: (convertToYmd) ?dateToYmd(previousQuarterEndDate) : previousQuarterEndDate,
      },
    };
  }

  function getYearDates(date, convertToYmd = true) {
    const year = date.getFullYear();

    const currentYearStartDate = new Date(year, 0, 1);
    const currentYearEndDate = new Date(year, 11, 31);

    const previousYearStartDate = new Date(year - 1, 0, 1);
    const previousYearEndDate = new Date(year - 1, 11, 31);

    return {
        currentYear: {
            startDate: convertToYmd ? dateToYmd(currentYearStartDate) : currentYearStartDate,
            endDate: convertToYmd ? dateToYmd(currentYearEndDate) : currentYearEndDate,
        },
        previousYear: {
            startDate: convertToYmd ? dateToYmd(previousYearStartDate) : previousYearStartDate,
            endDate: convertToYmd ? dateToYmd(previousYearEndDate) : previousYearEndDate,
        },
    };
}



  export { getYearDates, getQuarterDates,dateToYmd,getPreviousNthDate,getCurrentMonthStartDate,getPreviousMonthStartEndDate }