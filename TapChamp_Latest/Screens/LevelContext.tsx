
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LevelContext = createContext(null);

// const COOLDOWN_DURATION = 50000; // 1 maybe minutes in milliseconds
export const useLevel = () => {
  const context = useContext(LevelContext);
  if (!context) {
    throw new Error('useLevel must be used within a LevelProvider');
  }
  return context;
};
const LevelProvider = ({ children }) => {
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  //const [cooldownTime, setCooldownTime] = useState(COOLDOWN_DURATION / 1000);
  
  
  const decreaseAttempts = async () => {
    if (attemptsLeft > 0) {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      await AsyncStorage.setItem('@attemptsLeft', newAttempts.toString());
     
      if (newAttempts === 0) {
        const currentTime = new Date().getTime();
        await AsyncStorage.setItem('@cooldownStartTime', currentTime.toString());
     //   setCooldownTime(COOLDOWN_DURATION / 1000);
      }
    }
  };
  // Check cooldown on app launch
  
  
  //useEffect(() => {
   // const checkCooldownOnAppLaunch = async () => {
   //   const startTimeString = await AsyncStorage.getItem('@cooldownStartTime');
   //   if (startTimeString) {
   //     const startTime = parseInt(startTimeString, 10);
    //    const currentTime = new Date().getTime();
   //     const elapsedTime = currentTime - startTime;
    //    if (elapsedTime >= COOLDOWN_DURATION) {
   //       resetAttempts(); // Reset the attempts if the cooldown period has elapsed
   //     } else {
   //       setCooldownTime((COOLDOWN_DURATION - elapsedTime) / 1000);
   //     }
  //    }
//    };
 //   checkCooldownOnAppLaunch();
//  }, []);
  
  useEffect(() => {
    const fetchUnlockedLevels = async () => {
      const storedUnlockedLevels = await AsyncStorage.getItem('@unlockedLevels');
      if (storedUnlockedLevels) {
        setUnlockedLevels(JSON.parse(storedUnlockedLevels));
      }
    };
    const getAttempts = async () => {
      const storedAttempts = await AsyncStorage.getItem('@attemptsLeft');
      if (storedAttempts) {
        setAttemptsLeft(Number(storedAttempts));
      }
    };
    fetchUnlockedLevels();
    getAttempts();
  }, []);




  useEffect(() => {
    const updateUnlockedLevelsInStorage = async () => {
      await AsyncStorage.setItem('@unlockedLevels', JSON.stringify(unlockedLevels));
    };
    updateUnlockedLevelsInStorage();
  }, [unlockedLevels]);




//  useEffect(() => {
   // let cooldownInterval = null;
    // if (attemptsLeft === 0 && cooldownTime > 0) {
     // cooldownInterval = setInterval(() => {
      //  setCooldownTime(prevTime => {
        //  if (prevTime <= 1) {
           // clearInterval(cooldownInterval); // Clear the interval
          //  resetAttempts(); // Reset attempts when cooldown reaches 0
         //   return 0;
        //  } else {
         //   return prevTime - 1;
       //   }
     //   });
    //  }, 1000);
   // }
   // return () => {
      // if (cooldownInterval) {
     //   clearInterval(cooldownInterval);
    //  }
   // };
  // }, [attemptsLeft, cooldownTime]);


  const resetAttempts = async () => {
    setAttemptsLeft(3);
  //  setCooldownTime(0); // reset cooldown time
    await AsyncStorage.setItem('@attemptsLeft', '3');
  };
  
  
  const addIapLives = async () => {
    const newAttempts = attemptsLeft + 5; // Add 5 additional lives from IAP
    console.log(`Adding IAP lives. Current: ${attemptsLeft}, New: ${newAttempts}`);
  
    setAttemptsLeft(newAttempts);
    try {
      await AsyncStorage.setItem('@attemptsLeft', newAttempts.toString());
      // Remove the cooldown start time as the player has more lives now.
      await AsyncStorage.removeItem('@cooldownStartTime');
      console.log('IAP lives added and stored successfully');
    } catch (error) {
      console.error('Error storing new attempts in AsyncStorage', error);
    }
  };


  return (
    <LevelContext.Provider value={{ unlockedLevels, setUnlockedLevels, attemptsLeft, setAttemptsLeft, decreaseAttempts, resetAttempts, addIapLives }}>
    {children}
  </LevelContext.Provider>
  );
};
export { LevelContext, LevelProvider };
