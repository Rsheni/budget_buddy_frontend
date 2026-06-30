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
    TextInput,
    Switch,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../api/profileService';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const EditProfileScreen = ({ navigation }: any) => {
    const { user, updateUser } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [email, setEmail] = useState(user?.email || '');
    const [pushNotifications, setPushNotifications] = useState(true);
    
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Profile photo handling (supporting full URLs, relative local paths, or locally selected URIs)
    const getProfilePhoto = () => {
        if (selectedPhoto) {
            return selectedPhoto;
        }
        if (!user || !user.profilePicture) {
            return `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=00C896&color=fff&size=150`;
        }
        if (user.profilePicture.startsWith('http')) {
            return user.profilePicture;
        }
        return `http://localhost:5000/${user.profilePicture}`;
    };

    const handlePickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        });

        if (result.assets && result.assets.length > 0) {
            setSelectedPhoto(result.assets[0].uri || null);
        }
    };

    const handleUpdate = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Username cannot be empty.');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('email', email.trim().toLowerCase());
            formData.append('phoneNumber', phoneNumber.trim());

            if (selectedPhoto) {
                // @ts-ignore
                formData.append('profilePicture', {
                    uri: selectedPhoto,
                    type: 'image/jpeg',
                    name: `profile-${Date.now()}.jpg`,
                });
            }

            const updatedUser = await updateUserProfile(formData);
            await updateUser(updatedUser);

            Alert.alert('Success', 'Profile updated successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]);
        } catch (error: any) {
            console.error('Update profile submit error:', error);
            const msg = error.response?.data?.message || 'Failed to update profile. Please try again.';
            Alert.alert('Error', msg);
        } finally {
            setSubmitting(false);
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
                    <Text style={styles.headerTitle}>Edit My Profile</Text>
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
                    {/* Overlapping Avatar Section */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: getProfilePhoto() }} style={styles.avatar} />
                            <TouchableOpacity style={styles.cameraBadge} onPress={handlePickImage}>
                                <Icon name="camera" size={18} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                    </View>

                    {/* Account Settings Forms */}
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Your full name"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                placeholder="+94 XX XXX XXXX"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="example@example.com"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Push Notifications Switch Toggle */}
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Push Notifications</Text>
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                trackColor={{ false: '#E5E7EB', true: '#00C896' }}
                                thumbColor={Platform.OS === 'android' ? COLORS.white : ''}
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity 
                            style={[styles.submitBtn, submitting && styles.disabledBtn]}
                            disabled={submitting}
                            onPress={handleUpdate}
                        >
                            {submitting ? (
                                <ActivityIndicator size="small" color={COLORS.white} />
                            ) : (
                                <Text style={styles.submitBtnText}>Update Profile</Text>
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
        paddingBottom: 120, // spacing for bottom nav
    },
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: 25,
        marginHorizontal: 20,
        marginTop: -50,
        paddingTop: 20,
        paddingBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 20,
    },
    avatarWrapper: {
        position: 'relative',
        marginTop: -65,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: COLORS.white,
        backgroundColor: '#E5E7EB',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#00C896',
        borderWidth: 2,
        borderColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginHorizontal: 24,
        marginBottom: 12,
    },
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 1,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#EAEAEA',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#1F2937',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 16,
    },
    switchLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    submitBtn: {
        backgroundColor: '#00C896',
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: 'center',
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
});

export default EditProfileScreen;
