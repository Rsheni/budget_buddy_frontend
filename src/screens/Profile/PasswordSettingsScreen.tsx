import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { updateUserPassword } from '../../api/profileService';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const PasswordSettingsScreen = ({ navigation }: any) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let timer: any;
        if (success) {
            timer = setTimeout(() => {
                navigation.navigate('Profile');
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [success]);

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await updateUserPassword({
                currentPassword,
                newPassword
            });

            setSuccess(true);
        } catch (error: any) {
            console.error('Password change submit error:', error);
            const msg = error.response?.data?.message || 'Failed to change password. Please verify current password.';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        // Success screen (green screen with centered checkmark circle)
        return (
            <SafeAreaView style={styles.successContainer}>
                <StatusBar backgroundColor="#00C896" barStyle="light-content" />
                <View style={styles.successContent}>
                    <View style={styles.checkCircle}>
                        <Icon name="check" size={70} color="#00C896" />
                    </View>
                    <Text style={styles.successText}>Password Has Been</Text>
                    <Text style={styles.successText}>Changed Successfully</Text>

                    <TouchableOpacity 
                        style={styles.doneBtn}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Text style={styles.doneBtnText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#00C896" barStyle="light-content" />

            <View style={styles.headerBanner}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Password Settings</Text>
                    <TouchableOpacity onPress={() => console.log('Notification pressed')} style={styles.backButton}>
                        <Icon name="bell-outline" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                >
                    {/* Form Card */}
                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Current Password</Text>
                            <TextInput
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={true}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={true}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Confirm New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmNewPassword}
                                onChangeText={setConfirmNewPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={true}
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity 
                            style={[styles.submitBtn, loading && styles.disabledBtn]}
                            disabled={loading}
                            onPress={handlePasswordChange}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={COLORS.white} />
                            ) : (
                                <Text style={styles.submitBtnText}>Change Password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

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
    scrollContent: {
        paddingTop: 30,
        paddingBottom: 120, // space for bottom nav
    },
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: 25,
        padding: 20,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginTop: -50,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#EAEAEA',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#1F2937',
    },
    submitBtn: {
        backgroundColor: '#00C896',
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#00C896',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    disabledBtn: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
        elevation: 0,
    },
    submitBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Success Screen Styles
    successContainer: {
        flex: 1,
        backgroundColor: '#00C896',
    },
    successContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    checkCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    successText: {
        color: COLORS.white,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 30,
    },
    doneBtn: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
        marginTop: 50,
    },
    doneBtnText: {
        color: '#00C896',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PasswordSettingsScreen;
