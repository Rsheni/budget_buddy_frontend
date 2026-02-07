import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import axios from 'axios';
import { useAuth, API_URL } from '../../context/AuthContext';
import GradientBackground from '../../components/GradientBackground';

const SecurityPinScreen = ({ navigation, route }: any) => {
    const { login } = useAuth();
    const { email, type } = route.params || { email: '', type: 'registration' };
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const inputs = useRef<any>([]);

    const handlePinChange = (text: string, index: number) => {
        if (text.length > 1) {
            // Handle paste if needed, but for now just take the last char
            text = text.charAt(text.length - 1);
        }
        const newPin = [...pin];
        newPin[index] = text;
        setPin(newPin);

        // Auto focus next input
        if (text !== '' && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && pin[index] === '' && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleSubmit = async () => {
        const fullPin = pin.join('');
        if (fullPin.length < 6) {
            Alert.alert('Error', 'Please enter the full 6-digit code');
            return;
        }

        setLoading(true);
        try {
            if (type === 'reset') {
                // Here you might just verify the pin and then go to ResetPassword
                // For simplicity, we'll assume the same verify-email logic or separate it
                // navigation.navigate('ResetPassword', { email, code: fullPin });
                Alert.alert('Info', 'Password reset logic to be finalized.');
                navigation.navigate('ResetPassword', { email });
            } else {
                const response = await axios.post(`${API_URL}/auth/verify-pin`, {
                    email,
                    pin: fullPin,
                });

                if (response.data.token) {
                    Alert.alert('Success', 'Email verified successfully!');
                    await login(response.data);
                }
            }
        } catch (error: any) {
            Alert.alert('Verification Failed', error.response?.data?.message || 'Invalid code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientBackground
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Security Pin</Text>
                    <Text style={styles.subtitle}>
                        Enter the 6-digit code sent to {email}
                    </Text>
                </View>

                <View style={styles.pinContainer}>
                    {pin.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputs.current[index] = ref)}
                            style={styles.pinInput}
                            value={digit}
                            onChangeText={(text) => handlePinChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            textAlign="center"
                            placeholder="0"
                            placeholderTextColor="rgba(255, 255, 255, 0.3)"
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.primaryDark} />
                    ) : (
                        <Text style={styles.buttonText}>Submit</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.resendButton} disabled={loading}>
                    <Text style={styles.resendText}>Send again</Text>
                </TouchableOpacity>
            </View>
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
        alignItems: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
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
        textAlign: 'center',
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
    },
    pinInput: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        fontSize: 24,
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    button: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.primaryDark,
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendButton: {
        marginTop: 25,
    },
    resendText: {
        color: 'white',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

export default SecurityPinScreen;
