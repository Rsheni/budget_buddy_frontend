import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { fetchCategories } from '../../api/categoryService';
import CustomBottomNav from '../../navigation/CustomBottomNav';

// 1. Define the Interface
interface CategoryItem {
  _id: string;
  categoryName: string;
  color: string;
  icon: string;
}


const CategoryScreen = () => {
  const navigation = useNavigation<any>();
  
  // 2. Apply the Interface to useState
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  
  const [viewType, setViewType] = useState<'income' | 'expense'>('expense');

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const result = await fetchCategories(viewType);
        setCategories(result);
      };
      load();
    }, [viewType])
  );

  const renderItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity 
        style={styles.cardContainer}
        // --- NAVIGATE AND PASS THE CATEGORY DATA ---
        onPress={() => navigation.navigate('CategoryDetail', { category: item })}
    >
      <View style={[styles.iconCircle, { backgroundColor: item.color ? item.color + '20' : '#E8FDF5' }]}> 
        <Image 
            source={{ uri: `https://img.icons8.com/ios/50/${(item.color || '000000').replace('#','')}/${item.icon || 'box'}.png` }} 
            style={{ width: 30, height: 30, tintColor: item.color || COLORS.primary }} 
        />
      </View>
      <Text style={styles.catName}>{item.categoryName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
           <TouchableOpacity onPress={() => navigation.goBack()}>
             <Image source={{ uri: 'https://img.icons8.com/ios/50/093030/left.png' }} style={styles.navIcon} />
           </TouchableOpacity>
           <Text style={styles.headerTitle}>Categories</Text>
           <View style={styles.navIcon}><Text>🔔</Text></View>
        </View>

        {/* Toggle Switch */}
        <View style={styles.toggleContainer}>
            <TouchableOpacity 
                style={[styles.toggleBtn, viewType === 'income' && styles.activeToggle]}
                onPress={() => setViewType('income')}
            >
                <Text style={[styles.toggleText, viewType === 'income' && styles.activeText]}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.toggleBtn, viewType === 'expense' && styles.activeToggle]}
                onPress={() => setViewType('expense')}
            >
                <Text style={[styles.toggleText, viewType === 'expense' && styles.activeText]}>Expense</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* Grid Content */}
      <View style={styles.content}>
        <FlatList
            data={categories}
            renderItem={renderItem}
            // 3. Now TypeScript knows item has _id
            keyExtractor={(item) => item._id} 
            numColumns={3}
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 50, color: '#888'}}>No categories found.</Text>}
        />
      </View>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreateCategory', { type: viewType })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <CustomBottomNav activeTab="Stack" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  navIcon: { width: 24, height: 24, tintColor: COLORS.textDark },

  toggleContainer: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 20, padding: 4, width: '60%', alignSelf: 'center' },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 16 },
  activeToggle: { backgroundColor: COLORS.primary },
  toggleText: { color: COLORS.textLight, fontWeight: '600' },
  activeText: { color: COLORS.white },

  content: { flex: 1, paddingHorizontal: 20 },
  
  // Card Styles
  cardContainer: { width: '30%', alignItems: 'center', marginBottom: 20, backgroundColor: COLORS.white, padding: 15, borderRadius: 20, elevation: 2 },
  iconCircle: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  catName: { fontSize: 12, fontWeight: '600', color: COLORS.textDark, textAlign: 'center' },

  fab: { position: 'absolute', bottom: 110, alignSelf: 'center', width: 60, height: 60, backgroundColor: COLORS.primary, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 10, borderWidth: 4, borderColor: COLORS.white },
  fabText: { fontSize: 30, color: COLORS.white, marginTop: -2 }
});

export default CategoryScreen;