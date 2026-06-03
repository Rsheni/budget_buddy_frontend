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
    RefreshControl,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { fetchGroupSettlements } from '../../api/groupService';

const SettlementHistoryScreen = ({ route, navigation }: any) => {
    const { groupId } = route.params;
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [settlements, setSettlements] = useState<any[]>([]);
    const [totalSettled, setTotalSettled] = useState(0);

    const loadSettlements = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const data = await fetchGroupSettlements(groupId);
            setSettlements(data.settlements || []);
            setTotalSettled(data.totalSettled || 0);
        } catch (error) {
            console.error('Error fetching settlements:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadSettlements();
    }, [groupId]);

    const onRefresh = () => {
        setRefreshing(true);
        loadSettlements(false);
    };

    const renderSettlementItem = ({ item }: { item: any }) => {
        const formattedDate = item.date 
            ? new Date(item.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
            : 'Unknown date';

        return (
            <View style={styles.settlementCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.participantRow}>
                        <View style={[styles.avatarCircle, { backgroundColor: '#E0F2FE' }]}>
                            <Icon name="account-arrow-right" size={20} color="#0EA5E9" />
                        </View>
                        <View style={styles.textDetails}>
                            <Text style={styles.activityText}>
                                <Text style={styles.boldText}>{item.payer}</Text> paid <Text style={styles.boldText}>{item.receiver}</Text>
                            </Text>
                            <Text style={styles.dateText}>{formattedDate}</Text>
                        </View>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountText}>Rs. {item.amount.toLocaleString()}</Text>
                        <View style={styles.verifiedBadge}>
                            <Icon name="check-circle" size={12} color="#057857" style={{marginRight: 2}} />
                            <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                    </View>
                </View>

                {/* Additional details */}
                <View style={styles.cardFooter}>
                    <View style={styles.methodBadge}>
                        <Icon 
                            name={item.paymentMethod === 'bank' ? "bank" : "cash"} 
                            size={12} 
                            color="#4B5563" 
                            style={{ marginRight: 4 }} 
                        />
                        <Text style={styles.methodText}>
                            {item.paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash Handover'}
                        </Text>
                    </View>
                    {item.notes ? (
                        <Text style={styles.notesText} numberOfLines={2}>
                            "{item.notes}"
                        </Text>
                    ) : null}
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
                <Text style={styles.headerTitle}>Settlement History</Text>
                <TouchableOpacity onPress={() => console.log('Notification pressed')} style={styles.backButton}>
                    <Icon name="bell-outline" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            {/* Total Debt Settled Card */}
            <View style={styles.summaryCard}>
                <View style={[styles.summaryIconCircle, { backgroundColor: '#E0F9F1' }]}>
                    <Icon name="handshake" size={32} color="#00C896" />
                </View>
                <View style={styles.summaryDetails}>
                    <Text style={styles.summaryLabel}>TOTAL GROUP DEBT SETTLED</Text>
                    <Text style={styles.summaryAmount}>
                        Rs. {Math.round(totalSettled).toLocaleString()}
                    </Text>
                    <Text style={styles.summaryCount}>
                        {settlements.length} settlement{settlements.length !== 1 ? 's' : ''} recorded
                    </Text>
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.sectionTitle}>PAST SETTLEMENTS</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#00C896" style={{ marginTop: 40 }} />
                ) : settlements.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon name="receipt" size={60} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No settlements yet</Text>
                        <Text style={styles.emptySubtext}>When members pay each other back, the payments will appear here.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={settlements}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSettlementItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#00C896']}
                            />
                        }
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
    summaryCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    summaryIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    summaryDetails: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#9CA3AF',
        letterSpacing: 0.8,
        marginBottom: 4,
    },
    summaryAmount: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    summaryCount: {
        fontSize: 13,
        color: '#6B7280',
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    listContent: {
        paddingBottom: 30,
    },
    settlementCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.01,
        shadowRadius: 4,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    participantRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    textDetails: {
        flex: 1,
    },
    activityText: {
        fontSize: 14,
        color: '#374151',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#1F2937',
    },
    dateText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },
    amountContainer: {
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    amountText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#057857', // Green amount text for positive settlement action
        marginBottom: 4,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 8,
    },
    verifiedText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#057857',
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 12,
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    methodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    methodText: {
        fontSize: 11,
        color: '#4B5563',
    },
    notesText: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic',
        flex: 1,
        textAlign: 'right',
        marginLeft: 15,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4B5563',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
    },
});

export default SettlementHistoryScreen;
