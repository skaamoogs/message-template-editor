import { useState } from "react";

// force component re-render
export const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue((prevState) => prevState + 1);
};
