import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { createSettlement } from '../../api/groupService';

const SettlePaymentScreen = ({ route, navigation }: any) => {
    const { groupId, receiverId, receiverName, amount, paymentMethod: initialMethod } = route.params;
    
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank'>(initialMethod || 'cash');
    const [settleAmount, setSettleAmount] = useState(Math.round(amount).toString());
    const [notes, setNotes] = useState('Settled expense balance');
    
    // Bank Transfer Details
    const [bankName, setBankName] = useState('Commercial Bank');
    const [accountNumber, setAccountNumber] = useState('1000-2345-6789');
    const [branchName, setBranchName] = useState('Colombo Main');
    
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (!settleAmount.trim() || isNaN(Number(settleAmount)) || Number(settleAmount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
            return;
        }

        setSubmitting(true);
        try {
            const payload: any = {
                receiverId,
                amount: Number(settleAmount),
                paymentMethod,
                notes: notes.trim(),
            };

            if (paymentMethod === 'bank') {
                payload.bankDetails = {
                    bankName: bankName.trim(),
                    accountNumber: accountNumber.trim(),
                    branchName: branchName.trim(),
                };
            }

            await createSettlement(groupId, payload);
            
            Alert.alert(
                'Settlement Recorded',
                `Payment of Rs. ${Number(settleAmount).toLocaleString()} to ${receiverName} has been successfully recorded.`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate back to SettleUp screen and pass the receiverId to mark as settled
                            navigation.navigate('SettleUp', { settledMemberId: receiverId });
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('Error creating settlement:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to record settlement.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={28} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Record Payment</Text>
                <TouchableOpacity onPress={() => console.log('Notification pressed')} style={styles.backButton}>
                    <Icon name="bell-outline" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.subtitle}>Paying to <Text style={{fontWeight: 'bold'}}>{receiverName}</Text></Text>

                    {/* Method Selector */}
                    <Text style={styles.sectionLabel}>CHOOSE METHOD</Text>
                    <View style={styles.methodContainer}>
                        {/* Cash Radio */}
                        <TouchableOpacity 
                            style={[styles.methodCard, paymentMethod === 'cash' && styles.activeMethodCard]}
                            onPress={() => setPaymentMethod('cash')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.radioRow}>
                                <Icon 
                                    name={paymentMethod === 'cash' ? "radiobox-marked" : "radiobox-blank"} 
                                    size={22} 
                                    color={paymentMethod === 'cash' ? '#00C896' : '#9CA3AF'} 
                                />
                                <Icon name="cash-multiple" size={24} color={paymentMethod === 'cash' ? '#00C896' : '#6B7280'} style={{marginLeft: 8}} />
                            </View>
                            <Text style={[styles.methodName, paymentMethod === 'cash' && styles.activeMethodName]}>Cash Handover</Text>
                            <Text style={styles.methodDesc}>Handover cash directly in person</Text>
                        </TouchableOpacity>

                        {/* Bank Radio */}
                        <TouchableOpacity 
                            style={[styles.methodCard, paymentMethod === 'bank' && styles.activeMethodCard]}
                            onPress={() => setPaymentMethod('bank')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.radioRow}>
                                <Icon 
                                    name={paymentMethod === 'bank' ? "radiobox-marked" : "radiobox-blank"} 
                                    size={22} 
                                    color={paymentMethod === 'bank' ? '#00C896' : '#9CA3AF'} 
                                />
                                <Icon name="bank" size={24} color={paymentMethod === 'bank' ? '#00C896' : '#6B7280'} style={{marginLeft: 8}} />
                            </View>
                            <Text style={[styles.methodName, paymentMethod === 'bank' && styles.activeMethodName]}>Bank Transfer</Text>
                            <Text style={styles.methodDesc}>Transfer directly to bank account</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Amount & Notes */}
                    <Text style={styles.sectionLabel}>PAYMENT DETAILS</Text>
                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Amount (Rs.)</Text>
                            <TextInput
                                style={styles.input}
                                value={settleAmount}
                                onChangeText={setSettleAmount}
                                keyboardType="numeric"
                                placeholder="0.00"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Notes</Text>
                            <TextInput
                                style={[styles.input, { minHeight: 60 }]}
                                value={notes}
                                onChangeText={setNotes}
                                multiline
                                placeholder="Add notes here..."
                            />
                        </View>
                    </View>

                    {/* Dynamic Bank details form */}
                    {paymentMethod === 'bank' && (
                        <>
                            <Text style={styles.sectionLabel}>RECEIVER BANK DETAILS</Text>
                            <View style={styles.formCard}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Bank Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={bankName}
                                        onChangeText={setBankName}
                                        placeholder="E.g., National Bank"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Account Number</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={accountNumber}
                                        onChangeText={setAccountNumber}
                                        placeholder="E.g., 1234-5678-9012"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Branch Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={branchName}
                                        onChangeText={setBranchName}
                                        placeholder="E.g., Main Branch"
                                    />
                                </View>
                            </View>
                        </>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity 
                        style={[styles.submitBtn, submitting && styles.disabledBtn]}
                        disabled={submitting}
                        onPress={handleConfirm}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <Text style={styles.submitBtnText}>
                                {paymentMethod === 'cash' ? 'Confirm Cash Payment' : 'Confirm Bank Transfer'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#1F2937',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    subtitle: {
        fontSize: 15,
        color: '#4B5563',
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
        marginBottom: 10,
        letterSpacing: 0.5,
        marginTop: 10,
    },
    methodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    methodCard: {
        width: '48%',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.01,
        shadowRadius: 4,
        elevation: 1,
    },
    activeMethodCard: {
        borderColor: '#00C896',
        backgroundColor: '#F0FDF4',
    },
    radioRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    methodName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4B5563',
    },
    activeMethodName: {
        color: '#047857',
    },
    methodDesc: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 4,
    },
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.01,
        shadowRadius: 4,
        elevation: 1,
    },
    inputGroup: {
        marginBottom: 14,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: '#1F2937',
    },
    submitBtn: {
        backgroundColor: '#00C896',
        paddingVertical: 16,
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
});

export default SettlePaymentScreen;
