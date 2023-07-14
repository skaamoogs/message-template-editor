import { useState } from "react";

export const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return () => setValue((prevState) => prevState + 1);
};
