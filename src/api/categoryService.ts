import { API_URL } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchCategories = async (type: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/categories?type=${type}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const createCategory = async (data: any) => {
  try {
    const response = await fetch(`${API_URL}/categories/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
};

export const updateCategory = async (id: string, data: any) => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) { return null; }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch (error) { return false; }
};