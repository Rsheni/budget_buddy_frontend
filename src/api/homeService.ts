// Replace with your laptop's IP address if using Physical Phone
// e.g., 'http://192.168.1.5:5000/api/home'
const API_URL = 'http://10.0.2.2:5000/api/home'; 

export const fetchHomeData = async () => {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching home data:", error);
    return null;
  }
};