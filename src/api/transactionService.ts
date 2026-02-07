import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL
//const API_URL = 'http://10.0.2.2:5000/api/transactions';
const API_URL = 'http://localhost:5000/api/transactions';

// Helper to get headers with Token
const getAuthHeaders = async (isFormData = false) => {
  const token = await AsyncStorage.getItem('token');
  const headers: any = {
    'Authorization': `Bearer ${token}`
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const fetchTransactions = async (month: number, year: number, type: string, categoryId?: string, search?: string) => {
  try {
    let url = `${API_URL}?month=${month}&year=${year}&type=${type}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const headers = await getAuthHeaders();
    const response = await fetch(url, { headers });
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return null;
  }
};

export const addIncome = async (data: any) => {
  try {
    const isFormData = data instanceof FormData;
    const headers = await getAuthHeaders(isFormData);

    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: headers,
      body: isFormData ? data : JSON.stringify(data)
    });
    return await response.json();
  } catch (error) { return null; }
};

export const updateIncome = async (id: string, data: any) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) { return null; }
};

export const deleteIncome = async (id: string) => {
  try {
    const headers = await getAuthHeaders();
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: headers
    });
    return true;
  } catch (error) { return false; }
};