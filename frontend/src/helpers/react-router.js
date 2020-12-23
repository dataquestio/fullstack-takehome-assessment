import get from "lodash/get";

export const createLinkObject = (link = "") => {
  const linkParts = link.split("?");
  const pathname = get(linkParts, 0);
  const search = get(linkParts, 1);

  return {
    pathname,
    search
  };
};
