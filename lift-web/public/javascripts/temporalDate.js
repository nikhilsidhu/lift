const { Temporal, Intl, toTemporalInstant } = require('@js-temporal/polyfill');
Date.prototype.toTemporalInstant = toTemporalInstant;

function convertDate(inputDate) {

    const instant = inputDate.toTemporalInstant();
    const zoned = instant.toZonedDateTimeISO(Temporal.Now.timeZone());
    const plainDate = zoned.toPlainDate();
    //const convertedDate = Temporal.PlainDateTime.from(date);
    //console.log(convertedDate);
    const date = plainDate.getISOFields();

    return date;
}

module.exports = { convertDate };