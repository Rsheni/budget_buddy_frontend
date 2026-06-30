import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    Switch,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const NotificationSettingsScreen = ({ navigation }: any) => {
    // Configurable toggles state
    const [settings, setSettings] = useState({
        groupExpenses: true,
        groupInvitations: true,
        budgetWarnings: true,
        goalMilestones: true,
        monthlySummaries: false,
        lowBalanceAlerts: true,
        dailyReminders: false,
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem('notification_settings');
            if (stored) {
                setSettings(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load notification settings', error);
        }
    };

    const toggleSetting = async (key: keyof typeof settings) => {
        try {
            const updated = { ...settings, [key]: !settings[key] };
            setSettings(updated);
            await AsyncStorage.setItem('notification_settings', JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to save notification settings', error);
        }
    };

    const settingItems = [
        { key: 'groupExpenses' as const, label: 'Group Expenses & Settlements' },
        { key: 'groupInvitations' as const, label: 'Group Invitations' },
        { key: 'budgetWarnings' as const, label: 'Budget Threshold Warnings' },
        { key: 'goalMilestones' as const, label: 'Goal Progress & Milestones' },
        { key: 'monthlySummaries' as const, label: 'Monthly Spend Reports' },
        { key: 'lowBalanceAlerts' as const, label: 'Low Balance Alerts' },
        { key: 'dailyReminders' as const, label: 'Daily Logging Reminders' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#00C896" barStyle="light-content" />

            <View style={styles.headerBanner}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notification Settings</Text>
                    <TouchableOpacity onPress={() => console.log('Notification pressed')} style={styles.backButton}>
                        <Icon name="bell-outline" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Overlapping Settings Card */}
            <View style={styles.settingsCard}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {settingItems.map((item, idx) => (
                        <View 
                            key={item.key} 
                            style={[
                                styles.switchRow, 
                                idx === settingItems.length - 1 && { borderBottomWidth: 0 }
                            ]}
                        >
                            <Text style={styles.switchLabel}>{item.label}</Text>
                            <Switch
                                value={settings[item.key]}
                                onValueChange={() => toggleSetting(item.key)}
                                trackColor={{ false: '#E5E7EB', true: '#00C896' }}
                                thumbColor={Platform.OS === 'android' ? COLORS.white : ''}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Bottom Nav */}
            <CustomBottomNav activeTab="Profile" navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerBanner: {
        backgroundColor: '#00C896',
        paddingTop: Platform.OS === 'ios' ? 40 : 15,
        paddingHorizontal: 20,
        paddingBottom: 70,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    settingsCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 25,
        marginHorizontal: 20,
        marginTop: -50,
        marginBottom: 110, // space for bottom nav
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    switchLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
});

export default NotificationSettingsScreen;
