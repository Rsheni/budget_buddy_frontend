import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchGroups = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/groups`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.groups;
    } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
    }
};

export const fetchGroupExpenses = async (groupId: string) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/groups/${groupId}/expenses`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching group expenses:', error);
        return { expenses: [], summary: { totalSpend: 0, receiveAmount: 0, youOweAmount: 0 } };
    }
};

export const addGroupExpense = async (groupId: string, data: FormData) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(`${API_URL}/groups/${groupId}/expenses`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.expense;
    } catch (error) {
        console.error('Error adding group expense:', error);
        throw error;
    }
};

export const removeGroupExpense = async (groupId: string, expenseId: string) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/groups/${groupId}/expenses/${expenseId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing group expense:', error);
        throw error;
    }
};

export const fetchGroupSettings = async (groupId: string) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/groups/${groupId}/settings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching group settings:', error);
        throw error;
    }
};

export const updateGroupSettings = async (groupId: string, formData: FormData) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.put(`${API_URL}/groups/${groupId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating group settings:', error);
        throw error;
    }
};

export const addMembersToGroup = async (groupId: string, members: string[]) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(`${API_URL}/groups/${groupId}/members`, { members }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding members to group:', error);
        throw error;
    }
};

export const removeMemberFromGroup = async (groupId: string, memberId: string) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/groups/${groupId}/members/${memberId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing member from group:', error);
        throw error;
    }
};

export const fetchGroupBalances = async (groupId: string) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/groups/${groupId}/balances`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching group balances:', error);
        return { summary: { totalSpend: 0, receiveAmount: 0, youOweAmount: 0 }, debtsToReceive: [], debtsToPay: [], members: [] };
    }
};

export const createSettlement = async (groupId: string, data: any) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(`${API_URL}/groups/${groupId}/settlements`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating settlement:', error);
        throw error;
    }
};

export const fetchGroupSettlements = async (groupId: string) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/groups/${groupId}/settlements`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching group settlements:', error);
        return { totalSettled: 0, settlements: [] };
    }
};

export const fetchPendingInvitations = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/groups/invitations/pending`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.invitations;
    } catch (error) {
        console.error('Error fetching pending invitations:', error);
        return [];
    }
};

export const acceptInvitation = async (code: string) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(`${API_URL}/groups/invitations/accept`, { code }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error accepting invitation:', error);
        throw error;
    }
};

export const cancelInvitation = async (groupId: string, invitationId: string) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/groups/${groupId}/invitations/${invitationId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error canceling invitation:', error);
        throw error;
    }
};

export const deleteGroup = async (groupId: string) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
};
