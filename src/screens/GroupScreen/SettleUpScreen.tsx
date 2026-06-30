import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Platform,
    Alert,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { fetchGroupBalances, createSettlement } from '../../api/groupService';

// Pastel theme colors for initials avatars
const AVATAR_COLORS = ['#E0F2FE', '#F3E8FF', '#FEE2E2', '#FEF3C7', '#D1FAE5'];
const TEXT_COLORS = ['#0369A1', '#7E22CE', '#B91C1C', '#B45309', '#047857'];

const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
};

const getColorIndex = (name: string) => {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i);
    }
    return sum % AVATAR_COLORS.length;
};

const SettleUpScreen = ({ route, navigation }: any) => {
    const { groupId, groupName } = route.params;
    const [loading, setLoading] = useState(true);
    const [debtsToPay, setDebtsToPay] = useState<any[]>([]);

    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [settleAmount, setSettleAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadBalances = async () => {
        setLoading(true);
        try {
            const data = await fetchGroupBalances(groupId);
            setDebtsToPay(data.debtsToPay || []);
        } catch (error) {
            console.error('Error loading balances for Settle Up:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBalances();
    }, [groupId]);

    // Refresh balances when returning back from SettlePayment screen
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadBalances();
        });
        return unsubscribe;
    }, [navigation]);

    const totalOwed = debtsToPay.reduce((sum, d) => sum + d.amount, 0);

    const handleOpenHandOver = (member: any) => {
        setSelectedMember(member);
        setSettleAmount(Math.round(member.amount).toString());
        setModalVisible(true);
    };

    const handleHandOverSubmit = async () => {
        if (!settleAmount.trim() || isNaN(Number(settleAmount)) || Number(settleAmount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
            return;
        }

        const payAmount = Number(settleAmount);
        const totalOwedToMember = selectedMember.amount;

        if (payAmount > totalOwedToMember + 0.01) {
            Alert.alert('Invalid Amount', `You only owe Rs. ${Math.round(totalOwedToMember).toLocaleString()} to ${selectedMember.name}.`);
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                receiverId: selectedMember.memberId,
                amount: payAmount,
                paymentMethod: 'cash',
                notes: 'Hand over cash'
            };

            await createSettlement(groupId, payload);
            setModalVisible(false);

            // Fetch updated balances
            const data = await fetchGroupBalances(groupId);
            setDebtsToPay(data.debtsToPay || []);

            // Check if user paid full amount or partial
            const remaining = totalOwedToMember - payAmount;
            if (remaining <= 0.05) {
                Alert.alert(
                    'Settlement Recorded',
                    `You hand over money Rs. ${payAmount.toLocaleString()} to ${selectedMember.name}. You paid all!`,
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert(
                    'Settlement Recorded',
                    `You hand over money Rs. ${payAmount.toLocaleString()} to ${selectedMember.name}. Remaining balance: Rs. ${Math.round(remaining).toLocaleString()}`,
                    [{ text: 'OK' }]
                );
            }
        } catch (error: any) {
            console.error('Error creating cash settlement:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to record settlement.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderDebtItem = ({ item }: { item: any }) => {
        const colorIdx = getColorIndex(item.name);

        return (
            <View style={styles.debtCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.debtInfo}>
                        <View style={[styles.avatarCircle, { backgroundColor: AVATAR_COLORS[colorIdx] }]}>
                            <Text style={[styles.avatarText, { color: TEXT_COLORS[colorIdx] }]}>
                                {getInitials(item.name)}
                            </Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.memberName}>{item.name}</Text>
                            <Text style={styles.oweLabel}>You owe</Text>
                        </View>
                    </View>
                    
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountText}>
                            Rs. {Math.round(item.amount).toLocaleString()}
                        </Text>
                    </View>
                </View>

                {/* Two Action Buttons side-by-side */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity 
                        style={styles.handOverBtn}
                        onPress={() => handleOpenHandOver(item)}
                        activeOpacity={0.8}
                    >
                        <Icon name="hand-pointing-right" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
                        <Text style={styles.handOverBtnText}>Hand Over Money</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.bankTransferBtn}
                        onPress={() => navigation.navigate('SettlePayment', {
                            groupId,
                            receiverId: item.memberId,
                            receiverName: item.name,
                            amount: item.amount,
                            paymentMethod: 'bank'
                        })}
                        activeOpacity={0.8}
                    >
                        <Icon name="bank" size={16} color="#00C896" style={{ marginRight: 6 }} />
                        <Text style={styles.bankTransferBtnText}>Bank Transfer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={28} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settle Up</Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('SettlementHistory', { groupId })} 
                    style={styles.historyTextButton}
                >
                    <Text style={styles.historyBtnText}>History</Text>
                </TouchableOpacity>
            </View>

            {/* Total Balance Owed Summary Card (Red theme matching mockup) */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>TOTAL BALANCE</Text>
                <View style={styles.amountRow}>
                    <Text style={styles.summaryAmount}>
                        Rs. {Math.round(totalOwed).toLocaleString()}
                    </Text>
                    <Text style={styles.summarySubtext}>to pay back</Text>
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.sectionTitle}>SUGGESTED PAYMENTS</Text>

                {loading && debtsToPay.length === 0 ? (
                    <ActivityIndicator size="large" color="#00C896" style={{ marginTop: 40 }} />
                ) : debtsToPay.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon name="check-circle" size={60} color="#00C896" />
                        <Text style={styles.emptyText}>You are all settled up!</Text>
                        <Text style={styles.emptySubtext2}>No outstanding payments to make in this group.</Text>
                    </View>
                ) : (
                    /* Wrap in a container to enforce the 3 items height limit and show scroll */
                    <View style={styles.listContainer}>
                        <FlatList
                            data={debtsToPay}
                            keyExtractor={(item) => item.memberId}
                            renderItem={renderDebtItem}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={true}
                        />
                    </View>
                )}
            </View>

            {/* Hand Over Money Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Hand Over Money</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Icon name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {selectedMember && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.modalSubtitle}>
                                    Pay back cash directly to <Text style={{ fontWeight: 'bold' }}>{selectedMember.name}</Text>
                                </Text>
                                <Text style={styles.modalOwedInfo}>
                                    Total Debt: Rs. {Math.round(selectedMember.amount).toLocaleString()}
                                </Text>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Amount to pay (Rs.)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={settleAmount}
                                        onChangeText={setSettleAmount}
                                        keyboardType="numeric"
                                        placeholder="0.00"
                                        autoFocus
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.modalSubmitBtn, submitting && styles.disabledBtn]}
                                    disabled={submitting}
                                    onPress={handleHandOverSubmit}
                                >
                                    {submitting ? (
                                        <ActivityIndicator size="small" color={COLORS.white} />
                                    ) : (
                                        <Text style={styles.modalSubmitBtnText}>Settle</Text>
                                    )}
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
        paddingHorizontal: 20,
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
    historyTextButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    historyBtnText: {
        color: '#00C896',
        fontSize: 16,
        fontWeight: 'bold',
    },
    summaryCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    summaryLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 8,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    summaryAmount: {
        color: '#EF4444', // Red color for outstanding debts
        fontSize: 30,
        fontWeight: 'bold',
    },
    summarySubtext: {
        color: '#9CA3AF',
        fontSize: 14,
        marginLeft: 8,
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    /* Restrict list height to only fit exactly 3 items (~140px each) */
    listContainer: {
        maxHeight: 435,
        backgroundColor: 'transparent',
    },
    listContent: {
        paddingBottom: 10,
    },
    debtCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    debtInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    textContainer: {
        justifyContent: 'center',
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    oweLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#EF4444',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
    },
    handOverBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00C896',
        borderRadius: 10,
        paddingVertical: 10,
        marginRight: 8,
        flex: 1,
    },
    handOverBtnText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    bankTransferBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00C896',
        backgroundColor: COLORS.white,
        borderRadius: 10,
        paddingVertical: 9, // adjust slightly to balance border width
        flex: 1,
    },
    bankTransferBtnText: {
        color: '#00C896',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 16,
    },
    emptySubtext2: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 30,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
    },
    modalOwedInfo: {
        fontSize: 15,
        fontWeight: '600',
        color: '#9CA3AF',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#1F2937',
    },
    modalSubmitBtn: {
        backgroundColor: '#00C896',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        shadowColor: '#00C896',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    modalSubmitBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledBtn: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
        elevation: 0,
    },
});

export default SettleUpScreen;
