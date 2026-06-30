import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateUserProfile = async (formData: FormData) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.put(`${API_URL}/users/profile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export const updateUserPassword = async (data: any) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.put(`${API_URL}/users/profile/password`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};

export const deleteUserAccount = async (data: any) => {
    try {
        const token = await AsyncStorage.getItem('token');
        // axios.delete supports a second argument containing 'data' config property
        const response = await axios.delete(`${API_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};
