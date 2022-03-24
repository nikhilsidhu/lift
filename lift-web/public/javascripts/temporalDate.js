const { Temporal, Intl, toTemporalInstant } = require('@js-temporal/polyfill');
Date.prototype.toTemporalInstant = toTemporalInstant;

function convertDate(inputDate) {

    const instant = inputDate.toTemporalInstant();
    const zoned = instant.toZonedDateTimeISO(Temporal.Now.timeZone());
    const plainDate = zoned.toPlainDate();

    const date = plainDate.getISOFields();

    return date;
}

module.exports = { convertDate };