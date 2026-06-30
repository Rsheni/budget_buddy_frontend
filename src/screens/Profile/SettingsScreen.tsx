import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const SettingsScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#00C896" barStyle="light-content" />

            <View style={styles.headerBanner}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <TouchableOpacity onPress={() => console.log('Notification pressed')} style={styles.backButton}>
                        <Icon name="bell-outline" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Settings Options Card */}
            <View style={styles.settingsCard}>
                <View style={styles.menuContainer}>
                    {/* Notification Settings */}
                    <TouchableOpacity 
                        style={styles.menuItem} 
                        onPress={() => navigation.navigate('NotificationSettings')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#E0F9F1' }]}>
                            <Icon name="bell-ring" size={22} color="#00C896" />
                        </View>
                        <Text style={styles.menuText}>Notification Settings</Text>
                        <Icon name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Password Settings */}
                    <TouchableOpacity 
                        style={styles.menuItem} 
                        onPress={() => navigation.navigate('PasswordSettings')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#EEF2F6' }]}>
                            <Icon name="lock" size={22} color="#4B5563" />
                        </View>
                        <Text style={styles.menuText}>Password Settings</Text>
                        <Icon name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Delete Account */}
                    <TouchableOpacity 
                        style={[styles.menuItem, { borderBottomWidth: 0 }]} 
                        onPress={() => navigation.navigate('DeleteAccount')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                            <Icon name="account-remove" size={22} color="#EF4444" />
                        </View>
                        <Text style={[styles.menuText, { color: '#EF4444' }]}>Delete Account</Text>
                        <Icon name="chevron-right" size={20} color="#EF4444" style={{ opacity: 0.7 }} />
                    </TouchableOpacity>
                </View>
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
        backgroundColor: COLORS.white,
        borderRadius: 25,
        marginHorizontal: 20,
        marginTop: -50,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    menuContainer: {
        width: '100%',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
});

export default SettingsScreen;
