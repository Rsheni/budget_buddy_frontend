import React, { useState } from 'react';
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
    Modal,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { deleteUserAccount } from '../../api/profileService';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const DeleteAccountScreen = ({ navigation }: any) => {
    const { logout } = useAuth();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleDeleteClick = () => {
        if (!password) {
            Alert.alert('Error', 'Please enter your password to confirm.');
            return;
        }
        setModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        setModalVisible(false);
        setLoading(true);
        try {
            await deleteUserAccount({ password });
            Alert.alert('Account Deleted', 'Your account has been deleted permanently.', [
                {
                    text: 'OK',
                    onPress: async () => {
                        await logout();
                    }
                }
            ]);
        } catch (error: any) {
            console.error('Delete account submit error:', error);
            const msg = error.response?.data?.message || 'Failed to delete account. Please check your password.';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#00C896" barStyle="light-content" />

            <View style={styles.headerBanner}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Delete Account</Text>
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
                    {/* Overlapping Info Card */}
                    <View style={styles.card}>
                        <Text style={styles.warningTitle}>Are You Sure You Want To Delete Your Account?</Text>
                        
                        <View style={styles.warningBox}>
                            <Text style={styles.warningText}>
                                This action will permanently delete all of your data, and you will not be able to recover it. Please keep the following in mind before proceeding:
                            </Text>
                            <Text style={styles.warningBullet}>• All your expenses, income, and associated transactions will be eliminated.</Text>
                            <Text style={styles.warningBullet}>• You will not be able to access your groups or any related information.</Text>
                            <Text style={styles.warningBullet}>• This action cannot be undone.</Text>
                        </View>

                        {/* Password Entry */}
                        <Text style={styles.inputLabel}>Please Enter Your Password To Confirm Deletion Of Your Account</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={true}
                        />

                        {/* Buttons */}
                        <TouchableOpacity 
                            style={[styles.deleteBtn, loading && styles.disabledBtn]}
                            disabled={loading}
                            onPress={handleDeleteClick}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={COLORS.white} />
                            ) : (
                                <Text style={styles.deleteBtnText}>Yes, Delete Account</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.cancelBtn}
                            onPress={() => navigation.goBack()}
                            disabled={loading}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Delete Account Modal (Green/Teal matching mockup theme) */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Delete Account</Text>
                        <Text style={styles.modalSubtitle}>Are you sure you want to permanently delete your account?</Text>
                        <Text style={styles.modalNotice}>
                            By deleting your account, you agree that you understand the consequences of this action and that you agree to permanently delete your account and all associated data.
                        </Text>

                        <TouchableOpacity 
                            style={styles.modalConfirmBtn} 
                            onPress={handleConfirmDelete}
                        >
                            <Text style={styles.modalConfirmBtnText}>Yes, Delete Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.modalCancelBtn} 
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalCancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
    card: {
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
    warningTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 22,
    },
    warningBox: {
        backgroundColor: '#ECFDF5',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    warningText: {
        fontSize: 13,
        color: '#065F46',
        lineHeight: 18,
        marginBottom: 10,
    },
    warningBullet: {
        fontSize: 12,
        color: '#047857',
        lineHeight: 16,
        marginBottom: 6,
        paddingLeft: 6,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#EAEAEA',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    deleteBtn: {
        backgroundColor: '#EF4444',
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    deleteBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledBtn: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
        elevation: 0,
    },
    cancelBtn: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#4B5563',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalContent: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalNotice: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 16,
    },
    modalConfirmBtn: {
        backgroundColor: '#00C896',
        borderRadius: 16,
        paddingVertical: 14,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalConfirmBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalCancelBtn: {
        backgroundColor: '#E0F9F1',
        borderRadius: 16,
        paddingVertical: 14,
        width: '100%',
        alignItems: 'center',
    },
    modalCancelBtnText: {
        color: '#00C896',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DeleteAccountScreen;
