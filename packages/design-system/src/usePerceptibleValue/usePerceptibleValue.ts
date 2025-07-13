"use client";

import React from "react";

export function usePerceptibleValue<T>(
  value: T,
  { delay = 0, minDuration = 350 } = {},
) {
  const [perceptibleValue, setPerceptibleValue] = React.useState(value);
  const nextThresholdRef = React.useRef(0);

  React.useEffect(() => {
    const remaining = Math.max(0, nextThresholdRef.current - Date.now());

    const timer = setTimeout(() => {
      nextThresholdRef.current = Date.now() + minDuration;
      setPerceptibleValue(value);
    }, delay + remaining);

    return () => clearTimeout(timer);
  }, [value, delay, minDuration]);

  return perceptibleValue;
}
