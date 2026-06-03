import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar, Alert, Dimensions, Image } from 'react-native';
import { COLORS } from '../../constants/colors';
import { createCategory, updateCategory, deleteCategory } from '../../api/categoryService';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const { height } = Dimensions.get('window');

const COLOR_PALETTE = ['#00D09E', '#FF6347', '#4682B4', '#32CD32', '#FFD700', '#FF69B4', '#8A2BE2', '#00CED1'];
const ICONS = ['box', 'car', 'home', 'gift', 'shopping-bag', 'cutlery', 'airplane', 'pill'];

const CreateCategoryScreen = ({ navigation, route }: any) => {
    const { type, categoryToEdit } = route.params || { type: 'expense' };
    const isEditMode = !!categoryToEdit;

    const [name, setName] = useState('');
    const [selectedType, setSelectedType] = useState(type);
    const [limit, setLimit] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
    const [loading, setLoading] = useState(false);

    // ✨ Pre-fill form if Editing
    useEffect(() => {
        if (isEditMode) {
            setName(categoryToEdit.categoryName);
            setSelectedType(categoryToEdit.categoryType);
            setLimit(categoryToEdit.monthlyLimit ? categoryToEdit.monthlyLimit.toString() : '');
            setSelectedColor(categoryToEdit.color);
            setSelectedIcon(categoryToEdit.icon);
        }
    }, [isEditMode]);

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

        let result;
        if (isEditMode) {
            result = await updateCategory(categoryToEdit._id, data);
        } else {
            result = await createCategory(data);
        }

        setLoading(false);
        if (result) navigation.navigate('Categories'); // Go back to list to refresh
        else Alert.alert("Error", "Failed to save");
    };

    const handleDelete = async () => {
        Alert.alert("Delete", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: 'destructive', onPress: async () => {
                    await deleteCategory(categoryToEdit._id);
                    navigation.navigate('Categories');
                }
            }
        ]);
    };

    return (
        <View style={styles.rootContainer}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <View style={styles.greenHeaderBg} />

            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ fontSize: 24, color: COLORS.textDark }}>←</Text></TouchableOpacity>
                    <Text style={styles.headerTitle}>{isEditMode ? "Edit Category" : "Create Category"}</Text>

                    {/* ✨ Delete Icon */}
                    {isEditMode ? (
                        <TouchableOpacity onPress={handleDelete}><Text style={{ fontSize: 20 }}>🗑️</Text></TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => console.log('Notification pressed')}>
                        <Image source={{ uri: 'https://img.icons8.com/ios/50/093030/appointment-reminders.png' }} style={{ width: 24, height: 24 }} />
                      </TouchableOpacity>
                    )}
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput style={styles.input} placeholder="Category Name" value={name} onChangeText={setName} />

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

                    {selectedType === 'expense' && (
                        <>
                            <Text style={styles.label}>Monthly Budget Limit</Text>
                            <TextInput style={styles.input} placeholder="LKR Per Month" keyboardType="numeric" value={limit} onChangeText={setLimit} />
                        </>
                    )}

                    <Text style={styles.label}>Icon</Text>
                    <View style={styles.grid}>
                        {ICONS.map((icon, idx) => (
                            <TouchableOpacity key={idx} onPress={() => setSelectedIcon(icon)} style={[styles.iconItem, selectedIcon === icon && styles.selectedItem]}>
                                <Image source={{ uri: `https://img.icons8.com/ios/50/${(selectedColor || '000000').replace('#', '')}/${icon}.png` }} style={{ width: 24, height: 24 }} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Color</Text>
                    <View style={styles.grid}>
                        {COLOR_PALETTE.map((color, idx) => (
                            <TouchableOpacity key={idx} style={[styles.colorItem, { backgroundColor: color }, selectedColor === color && styles.selectedColor]} onPress={() => setSelectedColor(color)} />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                        <Text style={styles.saveText}>{loading ? "Saving..." : "Save"}</Text>
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