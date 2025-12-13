const API_URL = 'http://10.0.2.2:5000/api/categories'; 

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