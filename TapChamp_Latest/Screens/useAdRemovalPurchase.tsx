import { useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAdRemovalPurchase = () => {
  const [adRemovalPurchased, setAdRemovalPurchased] = useState(false);

  useEffect(() => {
    const checkAdRemovalPurchase = async () => {
      try {
        const purchased = await AsyncStorage.getItem('@removeAdsPurchased');
        if (purchased === 'true') {
          console.log('Remove ads purchased:', purchased);
          setAdRemovalPurchased(true);
        } else {
          // Handle situation accordingly if the value is not found
          console.log('Remove ads purchased key is not set in AsyncStorage');
        }
      } catch (error) {
        // Handling error if fetching the value fails
        console.error('Error retrieving data from AsyncStorage', error);
      }
    };

    const subscription = DeviceEventEmitter.addListener('removeAdsPurchased', (status) => {
      setAdRemovalPurchased(status);
    });

    checkAdRemovalPurchase();

    return () => {
      subscription.remove();
    };
  }, []);

  return adRemovalPurchased;
};

export default useAdRemovalPurchase;
