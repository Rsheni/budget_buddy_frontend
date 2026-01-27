// //const API_URL = 'http://10.0.2.2:5000/api/transactions'; 
// const API_URL = 'http://localhost:5000/api/transactions';

// export const fetchTransactions = async (month: number, year: number, type: string, categoryId?: string) => {
//   try {
//     let url = `${API_URL}?month=${month}&year=${year}&type=${type}`;
//     if (categoryId) {
//       url += `&categoryId=${categoryId}`;
//     }
    
//     const response = await fetch(url);
//     return await response.json();
//   } catch (error) {
//     return null;
//   }
// };

// // Generic Add Function (Works for Income OR Expense)
// export const addIncome = async (data: any) => {
//   try {
//     const response = await fetch(`${API_URL}/add`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     return await response.json();
//   } catch (error) {
//     console.error("Error adding transaction:", error);
//     return null;
//   }
// };

// // Update Function
// export const updateIncome = async (id: string, data: any) => {
//   try {
//     const response = await fetch(`${API_URL}/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     return await response.json();
//   } catch (error) {
//     console.error("Error updating transaction:", error);
//     return null;
//   }
// };

// // Delete Function
// export const deleteIncome = async (id: string) => {
//   try {
//     await fetch(`${API_URL}/${id}`, {
//       method: 'DELETE',
//     });
//     return true;
//   } catch (error) {
//     console.error("Error deleting transaction:", error);
//     return false;
//   }
// };
//const API_URL = 'http://10.0.2.2:5000/api/transactions'; 
const API_URL = 'http://localhost:5000/api/transactions';
export const fetchTransactions = async (month: number, year: number, type: string, categoryId?: string, search?: string) => {
  try {
    let url = `${API_URL}?month=${month}&year=${year}&type=${type}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (search) url += `&search=${encodeURIComponent(search)}`; // ✨ Handle Search
    
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
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
  } catch (error) { return null; }
};

export const updateIncome = async (id: string, data: any) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) { return null; }
};

export const deleteIncome = async (id: string) => {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) { return false; }
};