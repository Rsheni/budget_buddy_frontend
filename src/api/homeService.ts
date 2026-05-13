import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

export const fetchHomeData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${API_URL}/home`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch home data");
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching home data:", error);
    return null;
  }
};