import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Platform,
    Modal,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const ProfileScreen = ({ navigation }: any) => {
    const { user, logout } = useAuth();
    
    // Modal visibility states
    const [logoutVisible, setLogoutVisible] = useState(false);
    const [helpVisible, setHelpVisible] = useState(false);

    // Profile photo handling (supporting full URLs or local relative paths)
    const getProfilePhoto = () => {
        if (!user || !user.profilePicture) {
            return `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=00C896&color=fff&size=150`;
        }
        if (user.profilePicture.startsWith('http')) {
            return user.profilePicture;
        }
        return `http://localhost:5000/${user.profilePicture}`;
    };

    const handleConfirmLogout = async () => {
        setLogoutVisible(false);
        await logout();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#00C896" barStyle="light-content" />

            {/* Green top banner */}
            <View style={styles.headerBanner}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity onPress={() => console.log('Notification pressed')} style={styles.backButton}>
                        <Icon name="bell-outline" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Overlapping Profile Details Card */}
            <View style={styles.profileCard}>
                <Image source={{ uri: getProfilePhoto() }} style={styles.avatar} />
                <Text style={styles.profileName}>{user?.name || 'User'}</Text>

                {/* Option Menu List */}
                <View style={styles.menuContainer}>
                    {/* Edit Profile */}
                    <TouchableOpacity 
                        style={styles.menuItem} 
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                            <Icon name="account-edit" size={22} color="#0EA5E9" />
                        </View>
                        <Text style={styles.menuText}>Edit Profile</Text>
                        <Icon name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Setting */}
                    <TouchableOpacity 
                        style={styles.menuItem} 
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#EEF2F6' }]}>
                            <Icon name="cog" size={22} color="#4B5563" />
                        </View>
                        <Text style={styles.menuText}>Setting</Text>
                        <Icon name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Help */}
                    <TouchableOpacity 
                        style={styles.menuItem} 
                        onPress={() => setHelpVisible(true)}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#FFF7ED' }]}>
                            <Icon name="help-circle" size={22} color="#F97316" />
                        </View>
                        <Text style={styles.menuText}>Help</Text>
                        <Icon name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Logout */}
                    <TouchableOpacity 
                        style={[styles.menuItem, { borderBottomWidth: 0 }]} 
                        onPress={() => setLogoutVisible(true)}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                            <Icon name="logout" size={22} color="#EF4444" />
                        </View>
                        <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
                        <Icon name="chevron-right" size={20} color="#EF4444" style={{ opacity: 0.7 }} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Logout Modal */}
            <Modal
                transparent={true}
                visible={logoutVisible}
                animationType="fade"
                onRequestClose={() => setLogoutVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>End Session</Text>
                        <Text style={styles.modalSubtitle}>Are you sure you want to log out?</Text>

                        <TouchableOpacity 
                            style={styles.confirmBtn} 
                            onPress={handleConfirmLogout}
                        >
                            <Text style={styles.confirmBtnText}>Yes, End Session</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.cancelBtn} 
                            onPress={() => setLogoutVisible(false)}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Help Modal */}
            <Modal
                transparent={true}
                visible={helpVisible}
                animationType="slide"
                onRequestClose={() => setHelpVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '80%' }]}>
                        <View style={styles.helpHeader}>
                            <Text style={styles.helpTitle}>Help & Support</Text>
                            <TouchableOpacity onPress={() => setHelpVisible(false)}>
                                <Icon name="close" size={24} color="#4B5563" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%', marginTop: 10 }}>
                            <Text style={styles.faqTitle}>How to settle debts?</Text>
                            <Text style={styles.faqDesc}>
                                Navigate to a group, tap "Settle Up" at the top banner. Under Suggested Payments, you can choose "Hand Over Money" for direct cash settlements or "Bank Transfer" for record keeping.
                            </Text>

                            <Text style={styles.faqTitle}>How to edit profile?</Text>
                            <Text style={styles.faqDesc}>
                                Select the "Edit Profile" option from the main profile page to update your username, email, phone number, and profile picture.
                            </Text>

                            <Text style={styles.faqTitle}>How to secure account?</Text>
                            <Text style={styles.faqDesc}>
                                Visit Settings &gt; Password Settings to update your sign-in credentials.
                            </Text>

                            <Text style={styles.faqTitle}>How to delete account?</Text>
                            <Text style={styles.faqDesc}>
                                Visit Settings &gt; Delete Account. Warning: this operation will permanently remove all associated expense details and transactions.
                            </Text>
                        </ScrollView>
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
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: 25,
        marginHorizontal: 20,
        marginTop: -50,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: COLORS.white,
        marginTop: -65,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        backgroundColor: '#E5E7EB',
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 12,
        marginBottom: 20,
    },
    menuContainer: {
        width: '100%',
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
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
        marginBottom: 24,
        textAlign: 'center',
    },
    confirmBtn: {
        backgroundColor: '#00C896',
        borderRadius: 16,
        paddingVertical: 14,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    confirmBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelBtn: {
        backgroundColor: '#E0F9F1',
        borderRadius: 16,
        paddingVertical: 14,
        width: '100%',
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#00C896',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Help details
    helpHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 12,
    },
    helpTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    faqTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 15,
        marginBottom: 4,
    },
    faqDesc: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
});

export default ProfileScreen;
