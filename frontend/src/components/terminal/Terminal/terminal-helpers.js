import endsWith from "lodash/endsWith";
import findLastIndex from "lodash/findLastIndex";
import filter from "lodash/filter";
import includes from "lodash/includes";
import trim from "lodash/trim";

export const TERM_LINE_ENDING = "\r\n";

/**
 *
 * Returns an array of trimmed lines.
 *
 * @param buffer {Object}
 * @returns {Array}
 */
export const getTerminalLines = buffer => {
  const rows = buffer.active.length;
  let lines = [];

  for (let i = 0; i < rows; i++) {
    lines.push(
      buffer.active
        .getLine(i)
        .translateToString()
        .trim()
    );
  }

  return filter(lines, l => l.length);
};

/**
 *
 * Returns true if the last character of the input is `$`
 *
 * @param data
 * @returns {boolean}
 */
export const endsWithUserPrompt = data => {
  return endsWith(trim(data), "$");
};
