import React, { useEffect, useState, useContext } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLevel } from './LevelContext'; // Adjust the import path as needed

const COOLDOWN_DURATION = 50000; // 50 seconds for example

const CooldownComponent = () => {
  const { attemptsLeft, resetAttempts } = useLevel();
  const [cooldownEndTime, setCooldownEndTime] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0); // State to force re-render

  useEffect(() => {
    let intervalId;
    if (attemptsLeft === 0) {
      intervalId = setInterval(() => {
        setForceUpdate(prev => prev + 1); // Increment to trigger re-render
      }, 1000); // Update every second
    }

    return () => {
      clearInterval(intervalId); // Clear the interval when not needed
    };
  }, [attemptsLeft]); // Depend on attemptsLeft to setup or clear interval

  useEffect(() => {
    if (attemptsLeft > 0) {
      // If attempts are greater than 0, clear cooldown
      AsyncStorage.removeItem('@cooldownStartTime');
      setCooldownEndTime(null);
    } else {
      // Only calculate the cooldown end time if attempts are 0
      const calculateTimeLeft = async () => {
        const startTimeString = await AsyncStorage.getItem('@cooldownStartTime');
        if (startTimeString) {
          const startTime = parseInt(startTimeString, 10);
          const endTime = startTime + COOLDOWN_DURATION;
          setCooldownEndTime(endTime);
        } else {
          setCooldownEndTime(null);
        }
      };

      calculateTimeLeft();
    }
  }, [attemptsLeft, forceUpdate]); // Depend on attemptsLeft and forceUpdate

  useEffect(() => {
    if (cooldownEndTime && new Date().getTime() > cooldownEndTime) {
      resetAttempts();
    }
  }, [cooldownEndTime, resetAttempts]);

  const getFormattedTimeLeft = () => {
    const currentTime = new Date().getTime();
    const timeLeft = Math.max(cooldownEndTime - currentTime, 0);
    const secondsLeft = Math.floor(timeLeft / 1000);
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!cooldownEndTime || new Date().getTime() > cooldownEndTime) {
    return null;
  }

  return (
    <Text style={{ color: 'red', fontSize: 27, marginBottom: 40 }}>
      Time until lives are replenished: {getFormattedTimeLeft()}
    </Text>
  );
};

export default CooldownComponent;
