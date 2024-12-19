function adjustDates(dateFrom: Date, dateTo: Date, dateAccommodation: Date, timeForRange: Date | undefined, currentDate: Date | undefined): { dateFrom: Date, dateTo: Date } { // fixes time for dates in range
    if (!currentDate)
        currentDate = new Date(Date.now())
    if (!timeForRange)
        timeForRange = new Date(Date.now())

    const timeForDates = timeForRange ?? currentDate

    if (timeForDates) {
        if (dateFrom)
            dateFrom.setHours(timeForDates.getHours(), timeForDates.getMinutes(), timeForDates.getSeconds())
        if (dateTo)
            dateTo.setHours(timeForDates.getHours(), timeForDates.getMinutes(), timeForDates.getSeconds())
    }
    return { dateFrom, dateTo }
}

function toUnix(dates: Date): string {
    return Math.floor(dates.getTime() / 1000).toString();
}

export { adjustDates, toUnix }
