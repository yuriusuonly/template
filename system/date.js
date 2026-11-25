const pad = (value) => String(value).padStart(2, "0");

/**
 * Returns the current time as an ISO string.
 *
 * @returns {string} ISO timestamp.
 */
const now = () => new Date().toISOString();

/**
 * Returns the current time as epoch milliseconds.
 *
 * @returns {number} Epoch milliseconds.
 */
const epoch = () => Date.now();

/**
 * Converts a timestamp into a plain date object with UTC fields.
 *
 * @param {string | number} [input=now()] - Timestamp to parse.
 * @returns {object} Plain date fields with a `valid` flag.
 */
const parse = (input = now()) => {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return {
      valid: false,
      iso: "",
      epoch: 0,
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      weekday: "",
      timezone: "UTC"
    };
  }

  return {
    valid: true,
    iso: date.toISOString(),
    epoch: date.getTime(),
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
    millisecond: date.getUTCMilliseconds(),
    weekday: date.toUTCString().slice(0, 3),
    timezone: "UTC"
  };
};

/**
 * Formats a timestamp as a string.
 *
 * @param {string | number} [input=now()] - Timestamp to format.
 * @param {"iso" | "date" | "time" | "compact"} [style="iso"] - Output style.
 * @returns {string} Formatted timestamp, or "" when invalid.
 */
const format = (input = now(), style = "iso") => {
  const value = parse(input);

  if (!value.valid) return "";
  if (style === "date") return `${value.year}-${pad(value.month)}-${pad(value.day)}`;
  if (style === "time") return `${pad(value.hour)}:${pad(value.minute)}:${pad(value.second)}`;
  if (style === "compact") return `${pad(value.month)}${pad(value.day)}_${pad(value.hour)}${pad(value.minute)}`;

  return value.iso;
};

/**
 * Offsets a timestamp by milliseconds.
 *
 * @param {string | number} input - Base timestamp.
 * @param {number} milliseconds - Offset to apply.
 * @returns {string} ISO timestamp, or "" when invalid.
 */
const add = (input, milliseconds) => {
  const value = parse(input);
  return value.valid ? new Date(value.epoch + milliseconds).toISOString() : "";
};

/**
 * Returns the millisecond gap between two timestamps.
 *
 * @param {string | number} start - Start timestamp.
 * @param {string | number} end - End timestamp.
 * @returns {number} Difference in milliseconds, or 0 when invalid.
 */
const difference = (start, end) => {
  const first = parse(start);
  const second = parse(end);
  return first.valid && second.valid ? second.epoch - first.epoch : 0;
};

export {
  now,
  epoch,
  parse,
  format,
  add,
  difference
};
