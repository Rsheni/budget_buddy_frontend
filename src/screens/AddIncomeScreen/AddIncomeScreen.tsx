import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, StatusBar, Alert } from 'react-native';
import { COLORS } from '../../constants/colors';
import { addIncome } from '../../api/transactionService';

const CATEGORIES = [
  { id: 1, name: 'Salary', icon: '💰' }, // Changed to Income categories
  { id: 2, name: 'Gift', icon: '🎁' },
  { id: 3, name: 'Bonus', icon: '💼' },
  { id: 4, name: 'Other', icon: '🔹' },
];

const AddIncomeScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Salary');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    // 1. Validation
    if (!amount || !title) {
        Alert.alert("Missing Info", "Please enter an amount and a title.");
        return;
    }

    setIsSubmitting(true);

    // 2. Prepare Data
    const newIncome = {
      userId: "65d4f8a9e4b0a1b2c3d4e5f6", // Mock ID (Change later when Auth is done)
      amount: parseFloat(amount),
      categoryName: category,
      date: new Date(),
      description: title,
      type: 'income'
    };

    // 3. Send to Backend
    const result = await addIncome(newIncome);

    setIsSubmitting(false);

    // 4. Navigate Back
    if (result) {
        navigation.goBack(); // This triggers useFocusEffect in the previous screen
    } else {
        Alert.alert("Error", "Could not save income.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{fontSize: 24, color: COLORS.textDark}}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Income</Text>
        <Text>🔔</Text>
      </View>

      {/* Content Form */}
      <View style={styles.formContainer}>
        
        {/* Category Grid */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.catGrid}>
            {CATEGORIES.map((cat) => (
                <TouchableOpacity key={cat.id} style={styles.catItem} onPress={() => setCategory(cat.name)}>
                    <View style={[styles.catCircle, category === cat.name && styles.activeCat]}>
                        <Text style={{fontSize: 20}}>{cat.icon}</Text>
                    </View>
                    <Text style={styles.catName}>{cat.name}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {/* Amount Input */}
        <Text style={styles.label}>Amount</Text>
        <TextInput 
            style={styles.input} 
            placeholder="0.00" 
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
        />

        {/* Title Input */}
        <Text style={styles.label}>Income Title</Text>
        <TextInput 
            style={styles.input} 
            placeholder="e.g. Monthly Salary" 
            value={title}
            onChangeText={setTitle}
        />

        {/* Save Button */}
        <TouchableOpacity 
            style={[styles.saveBtn, isSubmitting && {opacity: 0.7}]} 
            onPress={handleSave}
            disabled={isSubmitting}
        >
            <Text style={styles.saveText}>{isSubmitting ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  
  formContainer: { 
    backgroundColor: COLORS.background, 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    flex: 1, 
    padding: 30,
    marginTop: 20,
    minHeight: 700 
  },
  
  label: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 10, marginTop: 15 },
  
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