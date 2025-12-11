import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar, Alert, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/colors';
import { addIncome, updateIncome, deleteIncome } from '../../api/transactionService';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const { height } = Dimensions.get('window');

// Define Categories for both types
const INCOME_CATEGORIES = [
  { id: 1, name: 'Salary', icon: '💰' },
  { id: 2, name: 'Gift', icon: '🎁' },
  { id: 3, name: 'Bonus', icon: '💼' },
  { id: 4, name: 'Other', icon: '🔹' },
];

const EXPENSE_CATEGORIES = [
  { id: 1, name: 'Food', icon: '🍔' },
  { id: 2, name: 'Transport', icon: '🚌' },
  { id: 3, name: 'Rent', icon: '🏠' },
  { id: 4, name: 'Shop', icon: '🛍️' },
];

const AddIncomeScreen = ({ navigation, route }: any) => {
  // Get Type from navigation params (Default to income)
  const { incomeToEdit, type = 'income' } = route.params || {};
  const isEditMode = !!incomeToEdit;
  const isExpense = type === 'expense'; // Boolean helper

  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  // Use correct category list
  const categories = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const [category, setCategory] = useState(categories[0].name);
  
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setAmount(incomeToEdit.amount.toString());
      setTitle(incomeToEdit.description);
      setCategory(incomeToEdit.categoryName || categories[0].name);
      setDate(new Date(incomeToEdit.date));
    }
  }, [isEditMode]);

  const handleSave = async () => {
    if (!amount || !title) return Alert.alert("Missing Info", "Enter amount and title");
    setIsSubmitting(true);

    const data = {
      userId: "65d4f8a9e4b0a1b2c3d4e5f6",
      amount: parseFloat(amount),
      categoryName: category,
      date: date,
      description: title,
      type: type // Save as 'income' or 'expense'
    };

    if (isEditMode) {
      await updateIncome(incomeToEdit._id, data);
    } else {
      await addIncome(data);
    }

    setIsSubmitting(false);
    navigation.goBack();
  };

  const handleDelete = async () => {
    Alert.alert("Delete Income", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: 'destructive', onPress: async () => {
          await deleteIncome(incomeToEdit._id);
          navigation.goBack();
      }}
    ]);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

return (
    <View style={styles.rootContainer}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.greenHeaderBg} />

      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{fontSize: 24, color: COLORS.textDark}}>←</Text>
            </TouchableOpacity>
            {/* Dynamic Title */}
            <Text style={styles.headerTitle}>
                {isEditMode ? `Edit ${isExpense ? 'Expense' : 'Income'}` : `Add ${isExpense ? 'Expense' : 'Income'}`}
            </Text>
            {isEditMode ? (
                <TouchableOpacity onPress={handleDelete}><Text style={{fontSize: 20}}>🗑️</Text></TouchableOpacity>
            ) : <Text>🔔</Text>}
        </View>

        <View style={styles.formContainer}>
            {/* Date Picker (Same Code) */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
                    <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                    <Text>📅</Text>
                </TouchableOpacity>
                {showPicker && <DateTimePicker value={date} mode="date" onChange={onDateChange} />}
            </View>

            <Text style={styles.label}>Category</Text>
            <View style={styles.catGrid}>
                {categories.map((cat) => (
                    <TouchableOpacity key={cat.id} style={styles.catItem} onPress={() => setCategory(cat.name)}>
                        <View style={[styles.catCircle, category === cat.name && styles.activeCat]}>
                            <Text style={{fontSize: 20}}>{cat.icon}</Text>
                        </View>
                        <Text style={styles.catName}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Amount</Text>
            <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={amount} onChangeText={setAmount} />

            <Text style={styles.label}>{isExpense ? "Expense Title" : "Income Title"}</Text>
            <TextInput style={styles.input} placeholder={isExpense ? "e.g. Dinner" : "e.g. Salary"} value={title} onChangeText={setTitle} />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSubmitting}>
                <Text style={styles.saveText}>{isSubmitting ? "Saving..." : "Save"}</Text>
            </TouchableOpacity>
            <View style={{height: 50}} /> 
        </View>
      </ScrollView>
      <CustomBottomNav activeTab="Swap" navigation={navigation} />
    </View>
  );
};


const styles = StyleSheet.create({
  // FIX: Main background is now the LIGHT color (removes green from bottom)
  rootContainer: { flex: 1, backgroundColor: COLORS.background },
  
  // FIX: Green box only at the top
  greenHeaderBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150, // Height of header area
    backgroundColor: COLORS.primary,
  },

  scrollContainer: { flex: 1 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    paddingTop: 50,
    // Removed backgroundColor here, relies on greenHeaderBg
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  
  formContainer: { 
    backgroundColor: COLORS.background, 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    padding: 30, 
    marginTop: 10, 
    minHeight: height - 120, 
  },
  
  label: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 10, marginTop: 15 },
  inputGroup: { marginBottom: 10 },
  dateInput: { backgroundColor: '#E8FDF5', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { color: COLORS.textDark, fontWeight: 'bold' },
  catGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  catItem: { alignItems: 'center' },
  catCircle: { width: 60, height: 60, backgroundColor: '#E8FDF5', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  activeCat: { backgroundColor: COLORS.blue },
  catName: { fontSize: 12, color: COLORS.textLight },
  input: { backgroundColor: '#E8FDF5', padding: 15, borderRadius: 15, fontWeight: 'bold', color: COLORS.textDark },
  saveBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 40 },
  saveText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' }
});

export default AddIncomeScreen;