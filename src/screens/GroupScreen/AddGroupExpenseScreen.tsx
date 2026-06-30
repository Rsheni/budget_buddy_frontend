import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { launchImageLibrary } from 'react-native-image-picker';
import { addGroupExpense } from '../../api/groupService';
import { useAuth } from '../../context/AuthContext';

const AddGroupExpenseScreen = ({ route, navigation }: any) => {
    const { user } = useAuth();
    const { groupId, groupName, members } = route.params;

    const [description, setDescription] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [paidById, setPaidById] = useState(user?.id);
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const [splitMethod, setSplitMethod] = useState<'equal' | 'percentage' | 'exact'>('equal');
    
    const [submitting, setSubmitting] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // Initial state for member selections and split values
    const [memberSplits, setMemberSplits] = useState(
        members.map((m: any) => ({
            userId: m.id,
            name: m.name,
            selected: true,
            percentage: '',
            amount: ''
        }))
    );

    const paidByName = members.find((m: any) => m.id === paidById)?.name || 'Select Member';

    const handlePickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
        });

        if (result.assets && result.assets.length > 0) {
            setReceiptImage(result.assets[0].uri || null);
        }
    };

    const toggleMemberSelection = (index: number) => {
        const updated = [...memberSplits];
        updated[index].selected = !updated[index].selected;
        setMemberSplits(updated);
    };

    const updateMemberSplitValue = (index: number, field: 'percentage' | 'amount', value: string) => {
        const updated = [...memberSplits];
        updated[index][field] = value;
        setMemberSplits(updated);
    };

    const handleAddExpense = async () => {
        if (!description.trim() || !totalAmount.trim()) {
            Alert.alert('Validation Error', 'Description and Total Amount are required.');
            return;
        }

        const amountNum = parseFloat(totalAmount);
        if (isNaN(amountNum) || amountNum <= 0) {
            Alert.alert('Validation Error', 'Please enter a valid amount.');
            return;
        }

        const selectedMembers = memberSplits.filter((m: any) => m.selected);
        if (selectedMembers.length === 0) {
            Alert.alert('Validation Error', 'You must select at least one member to split the expense with.');
            return;
        }

        // Validation based on method
        if (splitMethod === 'percentage') {
            let totalPct = 0;
            for (let m of selectedMembers) {
                const pct = parseFloat(m.percentage);
                if (isNaN(pct) || pct < 0) {
                    Alert.alert('Validation Error', 'Please enter valid percentages for all selected members.');
                    return;
                }
                totalPct += pct;
            }
            if (Math.abs(totalPct - 100) > 0.01) {
                Alert.alert('Validation Error', `Total percentage must be exactly 100%. Current total is ${totalPct}%.`);
                return;
            }
        } else if (splitMethod === 'exact') {
            let totalExact = 0;
            for (let m of selectedMembers) {
                const amt = parseFloat(m.amount);
                if (isNaN(amt) || amt < 0) {
                    Alert.alert('Validation Error', 'Please enter valid amounts for all selected members.');
                    return;
                }
                totalExact += amt;
            }
            if (Math.abs(totalExact - amountNum) > 0.01) {
                Alert.alert('Validation Error', `Total split amounts (${totalExact}) must equal the total expense amount (${amountNum}).`);
                return;
            }
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('description', description);
            formData.append('totalAmount', totalAmount);
            formData.append('paidById', paidById);
            formData.append('splitMethod', splitMethod);

            const splitsData = selectedMembers.map((m: any) => ({
                userId: m.userId,
                percentage: splitMethod === 'percentage' ? parseFloat(m.percentage) : 0,
                amount: splitMethod === 'exact' ? parseFloat(m.amount) : 0
            }));
            formData.append('splits', JSON.stringify(splitsData));

            if (receiptImage) {
                // @ts-ignore
                formData.append('receipt', {
                    uri: receiptImage,
                    type: 'image/jpeg',
                    name: 'receipt.jpg',
                });
            }

            await addGroupExpense(groupId, formData);
            Alert.alert('Success', 'Expense added successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to add expense');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color={COLORS.primaryDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{groupName}</Text>
                <TouchableOpacity onPress={() => console.log('Notification pressed')} style={styles.backButton}>
                    <Icon name="bell-outline" size={24} color={COLORS.primaryDark} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    
                    {/* Basic Info */}
                    <View style={styles.card}>
                        <Text style={styles.inputLabel}>Expense Description</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Dinner at SeaFood"
                            value={description}
                            onChangeText={setDescription}
                        />

                        <Text style={styles.inputLabel}>Total Amount (Rs.)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={totalAmount}
                            onChangeText={setTotalAmount}
                        />
                    </View>

                    {/* Paid By & Receipt */}
                    <View style={styles.card}>
                        <Text style={styles.inputLabel}>Paid By</Text>
                        <TouchableOpacity 
                            style={styles.dropdownButton}
                            onPress={() => setDropdownVisible(!dropdownVisible)}
                        >
                            <Text style={{ color: '#1F2937', fontSize: 16 }}>{paidByName}</Text>
                            <Icon name={dropdownVisible ? "chevron-up" : "chevron-down"} size={20} color="#666" />
                        </TouchableOpacity>
                        
                        {dropdownVisible && (
                            <View style={styles.dropdownList}>
                                {members.map((member: any) => (
                                    <TouchableOpacity 
                                        key={member.id} 
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setPaidById(member.id);
                                            setDropdownVisible(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{member.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <Text style={[styles.inputLabel, { marginTop: 15 }]}>Attach Bill / Receipt (Optional)</Text>
                        <TouchableOpacity style={styles.receiptUploadBtn} onPress={handlePickImage}>
                            {receiptImage ? (
                                <Image source={{ uri: receiptImage }} style={styles.receiptImage} />
                            ) : (
                                <View style={{ alignItems: 'center' }}>
                                    <Icon name="camera-plus" size={30} color={COLORS.primary} />
                                    <Text style={styles.receiptUploadText}>Tap to add receipt photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Split Methods */}
                    <View style={styles.card}>
                        <Text style={[styles.inputLabel, { marginBottom: 15 }]}>Split Method</Text>
                        
                        <View style={styles.tabsContainer}>
                            <TouchableOpacity 
                                style={[styles.tab, splitMethod === 'equal' && styles.activeTab]}
                                onPress={() => setSplitMethod('equal')}
                            >
                                <Text style={[styles.tabText, splitMethod === 'equal' && styles.activeTabText]}>Equal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.tab, splitMethod === 'percentage' && styles.activeTab]}
                                onPress={() => setSplitMethod('percentage')}
                            >
                                <Text style={[styles.tabText, splitMethod === 'percentage' && styles.activeTabText]}>Percentage</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.tab, splitMethod === 'exact' && styles.activeTab]}
                                onPress={() => setSplitMethod('exact')}
                            >
                                <Text style={[styles.tabText, splitMethod === 'exact' && styles.activeTabText]}>Custom</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.splitInstruction}>
                            {splitMethod === 'equal' && "Split equally among selected members."}
                            {splitMethod === 'percentage' && "Enter percentages for selected members. Must total 100%."}
                            {splitMethod === 'exact' && "Enter exact amounts for selected members. Must equal total amount."}
                        </Text>

                        {/* Member List for Splitting */}
                        <View style={styles.splitMembersList}>
                            {memberSplits.map((m: any, index: number) => (
                                <View key={m.userId} style={styles.splitMemberRow}>
                                    <TouchableOpacity 
                                        style={styles.memberCheckbox} 
                                        onPress={() => toggleMemberSelection(index)}
                                    >
                                        <Icon 
                                            name={m.selected ? "checkbox-marked" : "checkbox-blank-outline"} 
                                            size={24} 
                                            color={m.selected ? COLORS.primary : "#9CA3AF"} 
                                        />
                                        <Text style={styles.splitMemberName}>{m.name}</Text>
                                    </TouchableOpacity>
                                    
                                    {m.selected && splitMethod === 'percentage' && (
                                        <View style={styles.splitInputContainer}>
                                            <TextInput
                                                style={styles.splitInput}
                                                keyboardType="numeric"
                                                placeholder="0"
                                                value={m.percentage}
                                                onChangeText={(val) => updateMemberSplitValue(index, 'percentage', val)}
                                            />
                                            <Text style={styles.splitUnit}>%</Text>
                                        </View>
                                    )}

                                    {m.selected && splitMethod === 'exact' && (
                                        <View style={styles.splitInputContainer}>
                                            <Text style={styles.splitUnit}>Rs.</Text>
                                            <TextInput
                                                style={styles.splitInput}
                                                keyboardType="numeric"
                                                placeholder="0.00"
                                                value={m.amount}
                                                onChangeText={(val) => updateMemberSplitValue(index, 'amount', val)}
                                            />
                                        </View>
                                    )}

                                    {m.selected && splitMethod === 'equal' && (
                                        <Text style={styles.autoCalculatedText}>
                                            Rs. {totalAmount && !isNaN(parseFloat(totalAmount)) 
                                                ? (parseFloat(totalAmount) / memberSplits.filter((ms: any) => ms.selected).length).toFixed(2) 
                                                : "0.00"}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Spacer for bottom nav button */}
                    <View style={{ height: 30 }} />
                </KeyboardAvoidingView>
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.bottomBtnContainer}>
                <TouchableOpacity 
                    style={styles.submitBtn} 
                    onPress={handleAddExpense}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.submitBtnText}>Add Expense</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
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
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F6FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primaryDark,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Make room for floating button
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 15,
    },
    dropdownButton: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownList: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: 5,
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
    receiptUploadBtn: {
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 12,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
    },
    receiptImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    receiptUploadText: {
        marginTop: 8,
        fontSize: 14,
        color: '#6B7280',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 4,
        marginBottom: 15,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    splitInstruction: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    splitMembersList: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 10,
    },
    splitMemberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    memberCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    splitMemberName: {
        fontSize: 16,
        color: '#1F2937',
        marginLeft: 10,
        fontWeight: '500',
    },
    splitInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 10,
        width: 100,
    },
    splitInput: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 14,
        textAlign: 'right',
        color: '#1F2937',
    },
    splitUnit: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 4,
        marginRight: 4,
    },
    autoCalculatedText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    bottomBtnContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'transparent',
    },
    submitBtn: {
        backgroundColor: '#1F2937',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    submitBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default AddGroupExpenseScreen;
