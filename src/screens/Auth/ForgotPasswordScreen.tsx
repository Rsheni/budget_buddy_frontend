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

const ForgotPasswordScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNextStep = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, {
                email: email.trim().toLowerCase()
            });

            Alert.alert(
                'Success', 
                response.data.message || 'Verification PIN has been sent to your email.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('SecurityPin', { email: email.trim().toLowerCase(), type: 'reset' });
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('Forgot password request error:', error);
            const msg = error.response?.data?.message || 'Failed to send verification PIN. Please try again.';
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
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>
                        Enter your email address to receive a verification code.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="example@gmail.com"
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleNextStep}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.primaryDark} />
                        ) : (
                            <Text style={styles.buttonText}>Next Step</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.signUpText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
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
        lineHeight: 20,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 25,
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
    },
    buttonText: {
        color: COLORS.primaryDark,
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        color: 'white',
        opacity: 0.8,
    },
    signUpText: {
        color: 'white',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default ForgotPasswordScreen;
