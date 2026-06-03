import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    StatusBar,
    Platform,
    Modal,
    TextInput,
    ActivityIndicator,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import CustomBottomNav from '../../navigation/CustomBottomNav';
import { fetchGroupExpenses, addGroupExpense, removeGroupExpense, fetchGroupBalances } from '../../api/groupService';



const GroupDetailScreen = ({ route, navigation }: any) => {
    // If we passed the group object via navigation parameters
    const group = route.params?.group || {
        name: 'Family Trip',
        type: 'receive',
        totalSpend: 85000,
        youOweAmount: 21250,
        receiveAmount: 4500,
        members: []
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expensePayerId, setExpensePayerId] = useState('');
    const [expensePayerName, setExpensePayerName] = useState('Select Member');
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [groupData, setGroupData] = useState(group);
    
    // Expandable states
    const [debtsToReceive, setDebtsToReceive] = useState<any[]>([]);
    const [debtsToPay, setDebtsToPay] = useState<any[]>([]);
    const [receiveExpanded, setReceiveExpanded] = useState(false);
    const [payExpanded, setPayExpanded] = useState(false);
    const [expandedExpenses, setExpandedExpenses] = useState<string[]>([]);

    const isOwe = groupData.type === 'owe';

    // Load expenses on focus so it refreshes when coming back from Add Expense
    useFocusEffect(
        React.useCallback(() => {
            const loadExpenses = async () => {
                if (!groupData.id) return;
                setLoading(true);
                try {
                    const [expData, balData] = await Promise.all([
                        fetchGroupExpenses(groupData.id),
                        fetchGroupBalances(groupData.id)
                    ]);
                    
                    setActivities(expData.expenses || []);
                    setDebtsToReceive(balData.debtsToReceive || []);
                    setDebtsToPay(balData.debtsToPay || []);
                    
                    if (balData.summary || expData.summary) {
                        const summary = balData.summary || expData.summary;
                        setGroupData((prev: any) => ({
                            ...prev,
                            totalSpend: summary.totalSpend,
                            receiveAmount: summary.receiveAmount,
                            youOweAmount: summary.youOweAmount,
                            members: balData.members || prev.members || []
                        }));
                    }
                } catch (err) {
                    console.error('Error loading group detail data:', err);
                } finally {
                    setLoading(false);
                }
            };
            loadExpenses();
        }, [groupData.id])
    );

    const handleDeleteExpense = async (expenseId: string) => {
        Alert.alert(
            "Delete Expense",
            "Are you sure you want to delete this expense?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeGroupExpense(groupData.id, expenseId);
                            // Refresh expenses and summary
                            const data = await fetchGroupExpenses(groupData.id);
                            setActivities(data.expenses || []);
                            if (data.summary) {
                                setGroupData((prev: any) => ({
                                    ...prev,
                                    totalSpend: data.summary.totalSpend,
                                    receiveAmount: data.summary.receiveAmount,
                                    youOweAmount: data.summary.youOweAmount
                                }));
                            }
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete expense or you don't have permission.");
                        }
                    }
                }
            ]
        );
    };

    const toggleExpenseExpand = (expenseId: string) => {
        if (expandedExpenses.includes(expenseId)) {
            setExpandedExpenses(expandedExpenses.filter(id => id !== expenseId));
        } else {
            setExpandedExpenses([...expandedExpenses, expenseId]);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#00C896" barStyle="light-content" />

            {/* Top Green Background Section */}
            <View style={styles.headerBackground}>
                {/* Header Navbar */}
                <View style={styles.headerNavbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconCircle}>
                        <Icon name="arrow-left" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    
                    <Text style={styles.headerTitle}>{groupData.name}</Text>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity 
                            style={[styles.iconCircle, { marginRight: 8 }]}
                            onPress={() => console.log('Notification pressed')}
                        >
                            <Icon name="bell-outline" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.iconCircle}
                            onPress={() => navigation.navigate('GroupSettings', { groupId: groupData.id })}
                        >
                            <Icon name="cog" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Total Spend */}
                <View style={styles.totalSpendContainer}>
                    <Text style={styles.totalSpendLabel}>TOTAL GROUP SPEND</Text>
                    <Text style={styles.totalSpendAmount}>
                        Rs. {Math.round(groupData.totalSpend || 0).toLocaleString()}
                    </Text>
                </View>

                {/* Settle Up Button */}
                <TouchableOpacity 
                    style={styles.settleUpBtn}
                    onPress={() => navigation.navigate('SettleUp', { groupId: groupData.id, groupName: groupData.name })}
                >
                    <Icon name="wallet" size={20} color="#00C896" />
                    <Text style={styles.settleUpText}>Settle Up</Text>
                </TouchableOpacity>
            </View>

            {/* Overlapping Summary Boxes */}
            <View style={styles.summaryBoxesContainer}>
                {/* Left Box (To Receive) */}
                <TouchableOpacity 
                    style={styles.summaryBox}
                    onPress={() => setReceiveExpanded(!receiveExpanded)}
                    activeOpacity={0.8}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.boxLabel}>To Receive</Text>
                        <Icon name={receiveExpanded ? "chevron-up" : "chevron-down"} size={16} color="#6B7280" />
                    </View>
                    <Text style={styles.boxAmount}>
                        Rs. {Math.round(groupData.receiveAmount || 0).toLocaleString()}
                    </Text>
                    {receiveExpanded && (
                        <View style={styles.expandedDebtsContainer}>
                            {debtsToReceive.length === 0 ? (
                                <Text style={styles.emptyDebtsText}>No one owes you</Text>
                            ) : (
                                debtsToReceive.map((d: any, index: number) => (
                                    <Text key={d.memberId || index} style={styles.debtItemText}>
                                        • {d.name}: <Text style={{fontWeight: 'bold'}}>Rs. {Math.round(d.amount).toLocaleString()}</Text>
                                    </Text>
                                ))
                            )}
                        </View>
                    )}
                </TouchableOpacity>

                {/* Right Box (To Pay) */}
                <TouchableOpacity 
                    style={styles.summaryBox}
                    onPress={() => setPayExpanded(!payExpanded)}
                    activeOpacity={0.8}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.boxLabel}>To Pay</Text>
                        <Icon name={payExpanded ? "chevron-up" : "chevron-down"} size={16} color="#6B7280" />
                    </View>
                    <Text style={[styles.boxAmount, { color: '#EF4444' }]}>
                        Rs. {Math.round(groupData.youOweAmount || 0).toLocaleString()}
                    </Text>
                    {payExpanded && (
                        <View style={styles.expandedDebtsContainer}>
                            {debtsToPay.length === 0 ? (
                                <Text style={styles.emptyDebtsText}>You owe nothing</Text>
                            ) : (
                                debtsToPay.map((d: any, index: number) => (
                                    <Text key={d.memberId || index} style={[styles.debtItemText, { color: '#EF4444' }]}>
                                        • to {d.name}: <Text style={{fontWeight: 'bold'}}>Rs. {Math.round(d.amount).toLocaleString()}</Text>
                                    </Text>
                                ))
                            )}
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Recent Activity List */}
            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>Recent Activity</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="small" color="#00C896" style={{ marginTop: 20 }} />
                ) : activities.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No expenses yet. Add one!</Text>
                ) : (
                    activities.map((activity) => (
                        <TouchableOpacity 
                            key={activity.id} 
                            style={styles.activityItemWrapper}
                            onPress={() => toggleExpenseExpand(activity.id)}
                            activeOpacity={0.9}
                        >
                            <View style={styles.activityItem}>
                                <View style={styles.activityLeft}>
                                    <View style={[styles.activityIconWrapper, { backgroundColor: activity.color || '#E0E7FF' }]}>
                                        <Icon name={activity.icon || 'receipt'} size={24} color="#1F2937" />
                                    </View>
                                    <View>
                                        <Text style={styles.activityName}>{activity.title}</Text>
                                        <Text style={styles.activityPaidBy}>Paid by <Text style={{fontWeight: 'bold'}}>{activity.paidBy}</Text></Text>
                                    </View>
                                </View>
                                <View style={styles.activityRight}>
                                    <Text style={styles.activityAmount}>Rs. {activity.amount?.toLocaleString()}</Text>
                                    <Text style={styles.activityDate}>
                                        {activity.date && typeof activity.date === 'string' && activity.date.includes('T') 
                                            ? new Date(activity.date).toLocaleDateString() 
                                            : activity.date}
                                    </Text>
                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                        <TouchableOpacity onPress={() => handleDeleteExpense(activity.id)}>
                                            <Icon name="trash-can" size={18} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {/* Expanded Share Details */}
                            {expandedExpenses.includes(activity.id) && (
                                <View style={styles.expandedExpenseContainer}>
                                    <Text style={styles.splitsHeader}>MEMBER SHARES:</Text>
                                    {activity.splits && activity.splits.length > 0 ? (
                                        activity.splits.map((split: any, idx: number) => (
                                            <View key={split.userId || idx} style={styles.splitRow}>
                                                <Text style={styles.splitName}>
                                                    {split.userName}
                                                </Text>
                                                <Text style={styles.splitAmountValue}>
                                                    Rs. {Math.round(split.splitAmount).toLocaleString()}
                                                </Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.emptySplitsText}>No splits recorded (Split equally)</Text>
                                    )}
                                </View>
                            )}
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <View style={styles.addExpenseContainer}>
                <TouchableOpacity 
                    style={styles.addExpenseBtn}
                    onPress={() => navigation.navigate('AddGroupExpense', { 
                        groupId: groupData.id, 
                        groupName: groupData.name, 
                        members: groupData.members 
                    })}
                >
                    <Icon name="plus" size={24} color={COLORS.white} />
                    <Text style={styles.addExpenseBtnText}>Add Group Expense</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Nav */}
            <CustomBottomNav activeTab="Groups" navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerBackground: {
        backgroundColor: '#00C896', // Bright Green
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingHorizontal: 20,
        paddingBottom: 60, // extra padding for overlapping boxes
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerNavbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    totalSpendContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    totalSpendLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 5,
    },
    totalSpendAmount: {
        color: COLORS.white,
        fontSize: 36,
        fontWeight: 'bold',
    },
    settleUpBtn: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        marginHorizontal: 10,
    },
    settleUpText: {
        color: '#00C896',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    summaryBoxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: -35, // Pull up to overlap with green header
        marginBottom: 20,
    },
    summaryBox: {
        backgroundColor: COLORS.white,
        width: '48%',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    boxLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
        fontWeight: '500',
    },
    boxAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 200, // Make room for floating button & bottom nav
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#00C896',
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    activityItemWrapper: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 5,
        elevation: 1,
        overflow: 'hidden',
    },
    expandedDebtsContainer: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 8,
    },
    debtItemText: {
        fontSize: 12,
        color: '#4B5563',
        marginTop: 4,
    },
    emptyDebtsText: {
        fontSize: 11,
        color: '#9CA3AF',
        fontStyle: 'italic',
        marginTop: 4,
    },
    expandedExpenseContainer: {
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 10,
    },
    splitsHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#6B7280',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    splitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    splitName: {
        fontSize: 13,
        color: '#374151',
    },
    splitAmountValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1F2937',
    },
    emptySplitsText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    activityName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    activityPaidBy: {
        fontSize: 13,
        color: '#6B7280',
    },
    activityRight: {
        alignItems: 'flex-end',
    },
    activityAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    activityDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    addExpenseContainer: {
        position: 'absolute',
        bottom: 110, // Above bottom nav
        left: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 10,
    },
    addExpenseBtn: {
        backgroundColor: '#1F2937', // Dark color like mockup
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 30, // Pill shape
        width: '100%',
        shadowColor: '#1F2937',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    addExpenseBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    
    // Modal Styles
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
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 10,
    },
    dropdownButton: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dropdownList: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 10,
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#1F2937',
    },
    modalAddBtn: {
        backgroundColor: '#00C896',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    modalAddBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GroupDetailScreen;
