import { useState, useEffect, useCallback } from 'react';

const useTimer = (initialTime) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  const startTimer = useCallback(() => setIsActive(true), []);
  const stopTimer = useCallback(() => setIsActive(false), []);
  const resetTimer = useCallback(() => setTimeLeft(initialTime), [initialTime]);

  useEffect(() => {
    let timerId;

    if (isActive && timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 900);
    } else if (timeLeft === 0) {
      stopTimer();
    }

    return () => clearTimeout(timerId);
  }, [timeLeft, isActive, stopTimer]);

  return { timeLeft, startTimer, stopTimer, resetTimer };
}

export default useTimer;
