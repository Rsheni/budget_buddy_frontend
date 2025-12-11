const API_URL = 'http://10.0.2.2:5000/api/transactions'; 

// ✅ USE THIS ONE (Handles Income & Expense)
export const fetchTransactions = async (month: number, year: number, type: string) => {
  try {
    // URL becomes: http://10.0.2.2:5000/api/transactions?month=4&year=2025&type=expense
    const response = await fetch(`${API_URL}?month=${month}&year=${year}&type=${type}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return null;
  }
};

// Generic Add Function (Works for Income OR Expense)
export const addIncome = async (data: any) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding transaction:", error);
    return null;
  }
};

// Update Function
export const updateIncome = async (id: string, data: any) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating transaction:", error);
    return null;
  }
};

// Delete Function
export const deleteIncome = async (id: string) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return false;
  }
};