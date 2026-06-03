import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Image,
    SafeAreaView,
    StatusBar,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { fetchGroupBalances } from '../../api/groupService';

const SettleUpScreen = ({ route, navigation }: any) => {
    const { groupId, groupName } = route.params;
    const [loading, setLoading] = useState(true);
    const [debtsToPay, setDebtsToPay] = useState<any[]>([]);
    const [settledMembers, setSettledMembers] = useState<string[]>([]);

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

    // Handle return from SettlePaymentScreen
    useEffect(() => {
        if (route.params?.settledMemberId) {
            const settledId = route.params.settledMemberId;
            if (!settledMembers.includes(settledId)) {
                setSettledMembers(prev => [...prev, settledId]);
            }
            loadBalances(); // Refresh the list of debts from backend
        }
    }, [route.params?.settledMemberId]);

    const totalOwed = debtsToPay.reduce((sum, d) => {
        // Only count if not locally settled yet
        if (settledMembers.includes(d.memberId)) return sum;
        return sum + d.amount;
    }, 0);

    const renderDebtItem = ({ item }: { item: any }) => {
        const isSettled = settledMembers.includes(item.memberId);

        return (
            <View style={styles.debtCard}>
                <View style={styles.debtInfo}>
                    <Image 
                        source={{ uri: item.profilePicture || `https://ui-avatars.com/api/?name=${item.name}` }} 
                        style={styles.avatar} 
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.memberName}>{item.name}</Text>
                        <Text style={styles.debtLabel}>
                            {isSettled ? 'Paid successfully' : 'You owe'}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.actionContainer}>
                    <Text style={[styles.amountText, isSettled && styles.settledText]}>
                        Rs. {Math.round(item.amount).toLocaleString()}
                    </Text>
                    <TouchableOpacity 
                        style={[styles.settleBtn, isSettled && styles.settledBtn]}
                        disabled={isSettled}
                        onPress={() => navigation.navigate('SettlePayment', {
                            groupId,
                            receiverId: item.memberId,
                            receiverName: item.name,
                            amount: item.amount
                        })}
                    >
                        <Text style={[styles.settleBtnText, isSettled && styles.settledBtnText]}>
                            {isSettled ? 'Settled' : 'Settle'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#00C896" barStyle="light-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settle Up</Text>
                <TouchableOpacity onPress={() => console.log('Notification pressed')} style={styles.backButton}>
                    <Icon name="bell-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* Total Balance Owed Summary */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>TOTAL BALANCE TO PAY BACK</Text>
                <Text style={styles.summaryAmount}>
                    Rs. {Math.round(totalOwed).toLocaleString()}
                </Text>
                <Text style={styles.summarySubtext}>
                    {groupName}
                </Text>
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
                    <FlatList
                        data={debtsToPay}
                        keyExtractor={(item) => item.memberId}
                        renderItem={renderDebtItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#00C896',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 15,
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
    summaryCard: {
        backgroundColor: '#00C896',
        paddingHorizontal: 20,
        paddingBottom: 30,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    summaryLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 5,
    },
    summaryAmount: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: 'bold',
    },
    summarySubtext: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginTop: 5,
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6B7280',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    listContent: {
        paddingBottom: 20,
    },
    debtCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    debtInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    textContainer: {
        justifyContent: 'center',
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    debtLabel: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    actionContainer: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#EF4444',
        marginBottom: 6,
    },
    settleBtn: {
        backgroundColor: '#00C896',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    settleBtnText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: 'bold',
    },
    settledText: {
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    settledBtn: {
        backgroundColor: '#E5E7EB',
    },
    settledBtnText: {
        color: '#9CA3AF',
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
});

export default SettleUpScreen;
