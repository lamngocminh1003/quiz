import React, { useEffect, useState } from "react";

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
