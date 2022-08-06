import { IS_SAFARI } from "config";

export const newDate = (param) => {
  if (!param) {
    return new Date();
  }
  if (typeof param === "string") {
    return IS_SAFARI ? new Date(param.replace(/-/g, "/")) : new Date(param);
  }
  return new Date(param);
};
