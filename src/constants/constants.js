import { toDateInputValue } from "../utils/utils";

export const defaultFormData = {
  inputType: "out",
  moneyType: "cash",
  description: "",
  spentAt: toDateInputValue(new Date()),
};