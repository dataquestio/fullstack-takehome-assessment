/**
 * Pluck data attributes from props
 * @returns {object}
 */
const getDataAttributes = props => {
  const dataAttributes = {};

  for (let [key, value] of Object.entries(props)) {
    if (key.includes("data")) {
      dataAttributes[key] = value;
    }
  }

  return dataAttributes;
};

export default getDataAttributes;
