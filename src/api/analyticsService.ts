import axios from 'axios';
import { API_URL } from '../context/AuthContext';

export const fetchAnalyticsSummary = async (period: 'daily' | 'weekly' | 'monthly', month?: number, year?: number) => {
    const { data } = await axios.get(`${API_URL}/analytics/summary`, {
        params: { period, month, year }
    });
    return data;
};

export const fetchCategoryBreakdown = async (month?: number, year?: number) => {
    const { data } = await axios.get(`${API_URL}/analytics/categories`, {
        params: { month, year }
    });
    return data;
};

export const fetchCalendarData = async (month?: number, year?: number) => {
    const { data } = await axios.get(`${API_URL}/analytics/calendar`, {
        params: { month, year }
    });
    return data;
};

export const fetchGroupStats = async () => {
    const { data } = await axios.get(`${API_URL}/analytics/group-stats`);
    return data;
};
