import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar, Alert, Dimensions, Switch, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/colors';
import { addIncome, updateIncome, deleteIncome } from '../../api/transactionService';
import { fetchCategories } from '../../api/categoryService';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const { height } = Dimensions.get('window');

const AddIncomeScreen = ({ navigation, route }: any) => {
  const { incomeToEdit, type = 'income', preselectedCategory } = route.params || {};
  const isEditMode = !!incomeToEdit;
  const isExpense = type === 'expense';

  // Form State
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  // Categories State (Dynamic from DB)
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  
  // Recurring & Receipt State
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Load Categories from Database
  useEffect(() => {
    const loadCats = async () => {
        const result = await fetchCategories(type); 
        setCategories(result);
        
        // Auto-select the first category if creating a new entry and no preselection
        if (!isEditMode && !preselectedCategory && result.length > 0) {
            setSelectedCategoryId(result[0]._id);
        }
    };
    loadCats();
  }, [type]);

  // 2. Pre-fill Data if Editing OR if coming from Category Detail Page
  useEffect(() => {
    if (isEditMode) {
      setAmount(incomeToEdit.amount.toString());
      setTitle(incomeToEdit.description);
      // Handle populated category object or ID string
      setSelectedCategoryId(incomeToEdit.categoryId?._id || incomeToEdit.categoryId);
      setDate(new Date(incomeToEdit.date));
      setIsRecurring(incomeToEdit.isRecurring || false);
    } else if (preselectedCategory && categories.length > 0) {
        // Find ID of preselected category name (from DB list)
        const match = categories.find((c: any) => c.categoryName === preselectedCategory);
        if (match) setSelectedCategoryId(match._id);
    }
  }, [isEditMode, preselectedCategory, categories]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSave = async () => {
    // Validation 1: Check Text Inputs
    if (!amount || !title) {
        return Alert.alert("Missing Info", "Please enter an amount and a title.");
    }

    // Validation 2: Check Category Selection (CRITICAL for Dynamic Data)
    if (!selectedCategoryId) {
        return Alert.alert("Missing Info", "Please select a category.");
    }

    setIsSubmitting(true);

    const data = {
      userId: "65d4f8a9e4b0a1b2c3d4e5f6", // Mock User ID
      amount: parseFloat(amount),
      categoryId: selectedCategoryId, // Sending the Real MongoDB ID
      date: date,
      description: title,
      type: type,
      isRecurring: isRecurring,
    };

    if (isEditMode) await updateIncome(incomeToEdit._id, data);
    else await addIncome(data);

    setIsSubmitting(false);
    navigation.goBack();
  };

  const handleDelete = async () => {
    await deleteIncome(incomeToEdit._id);
    navigation.goBack();
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.greenHeaderBg} />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{fontSize: 24, color: COLORS.textDark}}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isEditMode ? `Edit ${isExpense ? 'Expense' : 'Income'}` : `Add ${isExpense ? 'Expense' : 'Income'}`}</Text>
            {isEditMode ? (
                <TouchableOpacity onPress={handleDelete}><Text style={{fontSize: 20}}>🗑️</Text></TouchableOpacity>
            ) : <Text style={{fontSize: 20}}>🔔</Text>}
        </View>

        <View style={styles.formContainer}>
            
            {/* Date Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
                    <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                    <Image source={{ uri: 'https://img.icons8.com/ios/50/093030/calendar.png' }} style={{ width: 22, height: 22 }} />
                </TouchableOpacity>
                {showPicker && <DateTimePicker value={date} mode="date" onChange={onDateChange} />}
            </View>

            {/* Dynamic Category List (Horizontal Scroll) */}
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                {categories.map((cat) => (
                    <TouchableOpacity key={cat._id} style={styles.catItem} onPress={() => setSelectedCategoryId(cat._id)}>
                        <View style={[
                            styles.catCircle, 
                            selectedCategoryId === cat._id && styles.activeCat, 
                            { backgroundColor: cat.color ? cat.color + '20' : '#E8FDF5' } // Fallback color
                        ]}>
                            {/* Dynamic Icon from URL */}
                            <Image 
                                source={{ uri: `https://img.icons8.com/ios/50/${(cat.color || '000000').replace('#','')}/${cat.icon || 'circle'}.png` }} 
                                style={{ width: 24, height: 24, tintColor: cat.color || COLORS.primary }} 
                            />
                        </View>
                        <Text style={styles.catName}>{cat.categoryName}</Text>
                    </TouchableOpacity>
                ))}
                
                {/* Shortcut to Create New Category */}
                <TouchableOpacity style={styles.catItem} onPress={() => navigation.navigate('CreateCategory', { type })}>
                    <View style={styles.catCircle}>
                         <Image source={{ uri: 'https://img.icons8.com/ios/50/093030/plus-math.png' }} style={{ width: 24, height: 24 }} />
                    </View>
                    <Text style={styles.catName}>Add</Text>
                </TouchableOpacity>
            </ScrollView>

            <Text style={styles.label}>Amount</Text>
            <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={amount} onChangeText={setAmount} />

            <Text style={styles.label}>{isExpense ? "Expense Title" : "Income Title"}</Text>
            <TextInput style={styles.input} placeholder={isExpense ? "e.g. Dinner" : "e.g. Salary"} value={title} onChangeText={setTitle} />

            {/* Recurring & Receipt Row */}
            <View style={styles.extraRow}>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Repeat Transaction</Text>
                    <Switch value={isRecurring} onValueChange={setIsRecurring} trackColor={{false: '#ddd', true: COLORS.primary}} />
                </View>
                <TouchableOpacity style={styles.receiptBtn} onPress={() => Alert.alert("Upload", "Camera logic here")}>
                     <Image source={{ uri: 'https://img.icons8.com/ios/50/ffffff/camera.png' }} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
            </View>

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
  rootContainer: { flex: 1, backgroundColor: COLORS.background },
  greenHeaderBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 150, backgroundColor: COLORS.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  formContainer: { backgroundColor: COLORS.background, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, marginTop: 10, minHeight: height - 120 },
  label: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 10, marginTop: 15 },
  inputGroup: { marginBottom: 10 },
  dateInput: { backgroundColor: '#E8FDF5', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { color: COLORS.textDark, fontWeight: 'bold' },
  input: { backgroundColor: '#E8FDF5', padding: 15, borderRadius: 15, fontWeight: 'bold', color: COLORS.textDark },
  saveBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 40 },
  saveText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  
  catScroll: { flexDirection: 'row', marginBottom: 10 },
  catItem: { alignItems: 'center', marginRight: 20 },
  catCircle: { width: 60, height: 60, backgroundColor: '#E8FDF5', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  activeCat: { borderWidth: 2, borderColor: COLORS.primary },
  catName: { fontSize: 12, color: COLORS.textLight },

  extraRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { marginRight: 10, color: COLORS.textDark, fontWeight: '600' },
  receiptBtn: { width: 50, height: 50, backgroundColor: COLORS.blue, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }
});

export default AddIncomeScreen;