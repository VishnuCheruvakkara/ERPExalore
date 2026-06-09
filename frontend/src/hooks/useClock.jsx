import { useEffect, useState } from "react";
import { getCurrentTime } from "../utils/timer";

export function useClock() {
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
}