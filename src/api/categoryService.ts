import { API_URL as BASE_URL } from '../context/AuthContext';

const API_URL = `${BASE_URL}/categories`;

export const fetchCategories = async (type: string) => {
  try {
    const response = await fetch(`${API_URL}?type=${type}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const createCategory = async (data: any) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
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
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) { return null; }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch (error) { return false; }
};