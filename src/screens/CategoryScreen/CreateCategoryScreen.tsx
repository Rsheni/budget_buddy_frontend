import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar, Alert, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';
import { createCategory } from '../../api/categoryService';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const { height } = Dimensions.get('window');

// Mock Data for Color/Icon Pickers
const COLOR_PALETTE = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#FF69B4', '#8A2BE2', '#00CED1'];
const ICONS = ['box', 'car', 'home', 'gift', 'shopping-bag', 'cutlery', 'airplane'];

const CreateCategoryScreen = ({ navigation, route }: any) => {
  const { type } = route.params || { type: 'expense' };
  
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState(type);
  const [limit, setLimit] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name) return Alert.alert("Error", "Name is required");
    setLoading(true);
    
    const data = {
        categoryName: name,
        categoryType: selectedType,
        monthlyLimit: parseFloat(limit) || 0,
        color: selectedColor,
        icon: selectedIcon
    };

    const result = await createCategory(data);
    setLoading(false);
    
    if(result) navigation.goBack();
    else Alert.alert("Error", "Failed to create category");
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.greenHeaderBg} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{fontSize: 24, color: COLORS.textDark}}>←</Text></TouchableOpacity>
            <Text style={styles.headerTitle}>Create Category</Text>
            <Text>🔔</Text>
        </View>

        <View style={styles.formContainer}>
            
            {/* Name Input */}
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} placeholder="Category Name" value={name} onChangeText={setName} />

            {/* Radio Buttons */}
            <View style={styles.radioRow}>
                <TouchableOpacity style={styles.radioBtn} onPress={() => setSelectedType('income')}>
                    <View style={[styles.radioCircle, selectedType === 'income' && styles.radioActive]} />
                    <Text style={styles.radioText}>Income</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.radioBtn} onPress={() => setSelectedType('expense')}>
                    <View style={[styles.radioCircle, selectedType === 'expense' && styles.radioActive]} />
                    <Text style={styles.radioText}>Expense</Text>
                </TouchableOpacity>
            </View>

            {/* Budget Input */}
            <Text style={styles.label}>Planned Outlay</Text>
            <TextInput style={styles.input} placeholder="LKR Per Month" keyboardType="numeric" value={limit} onChangeText={setLimit} />

            {/* Icon Picker */}
            <Text style={styles.label}>Icon</Text>
            <View style={styles.grid}>
                {ICONS.map((icon, idx) => (
                    <TouchableOpacity key={idx} onPress={() => setSelectedIcon(icon)} style={[styles.iconItem, selectedIcon === icon && styles.selectedItem]}>
                        <Text>📦</Text> 
                        {/* Use Image here in real app: uri: `https://img.icons8.com/ios/50/000000/${icon}.png` */}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Color Picker */}
            <Text style={styles.label}>Color</Text>
            <View style={styles.grid}>
                {COLOR_PALETTE.map((color, idx) => (
                    <TouchableOpacity 
                        key={idx} 
                        style={[styles.colorItem, { backgroundColor: color }, selectedColor === color && styles.selectedColor]} 
                        onPress={() => setSelectedColor(color)}
                    />
                ))}
            </View>

            {/* Add Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                <Text style={styles.saveText}>{loading ? "Saving..." : "Add"}</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomBottomNav activeTab="Stack" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: COLORS.background },
  greenHeaderBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 150, backgroundColor: COLORS.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  
  formContainer: { backgroundColor: COLORS.background, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, minHeight: height - 100 },
  
  label: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 10, marginTop: 15 },
  input: { backgroundColor: '#E8FDF5', padding: 15, borderRadius: 15, fontWeight: 'bold', color: COLORS.textDark },
  
  radioRow: { flexDirection: 'row', marginTop: 15, marginBottom: 5 },
  radioBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.primary, marginRight: 5 },
  radioActive: { backgroundColor: COLORS.primary },
  radioText: { color: COLORS.textDark, fontWeight: '600' },

  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  iconItem: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8FDF5', justifyContent: 'center', alignItems: 'center', margin: 5 },
  selectedItem: { borderWidth: 2, borderColor: COLORS.blue },
  
  colorItem: { width: 30, height: 30, borderRadius: 15, margin: 8 },
  selectedColor: { borderWidth: 3, borderColor: COLORS.textDark },

  saveBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 30 },
  saveText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' }
});

export default CreateCategoryScreen;