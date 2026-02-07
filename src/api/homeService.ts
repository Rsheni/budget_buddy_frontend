import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your laptop's IP address if using Physical Phone
// e.g., 'http://192.168.1.5:5000/api/home'
//const API_URL = 'http://10.0.2.2:5000/api/home';
const API_URL = 'http://localhost:5000/api/home';

export const fetchHomeData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(API_URL, {
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