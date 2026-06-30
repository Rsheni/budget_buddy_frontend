import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { COLORS } from '../../constants/colors';
import GradientBackground from '../../components/GradientBackground';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';

const ResetPasswordScreen = ({ route, navigation }: any) => {
    const { email, pin } = route.params || { email: '', pin: '' };
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, {
                email,
                pin,
                newPassword: password
            });

            Alert.alert(
                'Success', 
                response.data.message || 'Your password has been reset successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('SignIn');
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('Password reset submit error:', error);
            const msg = error.response?.data?.message || 'Failed to reset password. Please try again.';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientBackground
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>New Password</Text>
                    <Text style={styles.subtitle}>
                        Enter your new password below.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="********"
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Confirm New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="********"
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.primaryDark} />
                        ) : (
                            <Text style={styles.buttonText}>Change Password</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: 'white',
        opacity: 0.8,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        color: 'white',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 12,
        color: 'white',
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    button: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: COLORS.primaryDark,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ResetPasswordScreen;
