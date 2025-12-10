const API_URL = 'http://10.0.2.2:5000/api/transactions'; // Use localhost IP for real phone

export const fetchIncomes = async () => {
  try {
    const response = await fetch(`${API_URL}/income`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching incomes:", error);
    return null;
  }
};

export const addIncome = async (data: any) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding income:", error);
    return null;
  }
};