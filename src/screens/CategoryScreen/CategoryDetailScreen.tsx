import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { fetchTransactions } from '../../api/transactionService';
import { deleteCategory } from '../../api/categoryService';
import CustomBottomNav from '../../navigation/CustomBottomNav';
import { Alert } from 'react-native';

const CategoryDetailScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { category } = route.params;

  const [data, setData] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDelete = () => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.categoryName}"? This will not delete the associated transactions but they will lose their category.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteCategory(category._id);
            if (success) {
              Alert.alert('Success', 'Category deleted successfully');
              navigation.navigate('Categories');
            } else {
              Alert.alert('Error', 'Failed to delete category');
            }
          }
        }
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const result = await fetchTransactions(month, year, category.categoryType, category._id);
        setData(result);
      };
      load();
    }, [currentDate, category])
  );

  // Calculate Budget Progress
  const spent = data?.total || 0;
  const limit = category.monthlyLimit || 0;
  const progress = limit > 0 ? (spent / limit) : 0;
  const barWidth = Math.min(progress * 100, 100);
  const isOverBudget = spent > limit && limit > 0;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.greenHeaderBg} />

      {/* Header with Edit & Delete Icons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={{ uri: 'https://img.icons8.com/ios/50/093030/left.png' }} style={styles.navIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.categoryName}</Text>

        <View style={styles.actionIcons}>
          {/* Notification Button */}
          <TouchableOpacity onPress={() => console.log('Notification pressed')} style={{ marginRight: 15 }}>
            <Image source={{ uri: 'https://img.icons8.com/ios/50/093030/appointment-reminders.png' }} style={styles.navIcon} />
          </TouchableOpacity>

          {/* Edit Button */}
          <TouchableOpacity onPress={() => navigation.navigate('CreateCategory', { categoryToEdit: category })}>
            <Image source={{ uri: 'https://img.icons8.com/ios/50/093030/edit.png' }} style={styles.navIcon} />
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity onPress={handleDelete} style={{ marginLeft: 15 }}>
            <Image source={{ uri: 'https://img.icons8.com/ios/50/FF4D4D/trash.png' }} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Total Card & Budget Bar */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>Rs. {spent.toLocaleString()}</Text>

        {/* Budget Progress (Only for Expenses) */}
        {category.categoryType === 'expense' && limit > 0 && (
          <View style={styles.budgetContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${barWidth}%`, backgroundColor: isOverBudget ? '#FF4D4D' : category.color }
                ]}
              />
            </View>
            <View style={styles.budgetLabels}>
              <Text style={styles.budgetText}>Spent: {spent.toLocaleString()}</Text>
              <Text style={styles.budgetText}>Limit: {limit.toLocaleString()}</Text>
            </View>
            {isOverBudget && <Text style={styles.warningText}>⚠️ Over Budget!</Text>}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.monthLabel}>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>

        {/* Transaction List */}
        {data?.transactions?.map((item: any) => (
          <View key={item._id} style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: category.color + '20' }]}>
              <Image
                source={{ uri: `https://img.icons8.com/ios/50/${(category.color || '000000').replace('#', '')}/${category.icon || 'box'}.png` }}
                style={{ width: 24, height: 24, tintColor: category.color }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.description}</Text>
              <Text style={styles.rowPercent}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
            <Text style={[styles.rowAmount, { color: category.categoryType === 'expense' ? '#FF4D4D' : COLORS.textDark }]}>
              Rs.{item.amount}
            </Text>
          </View>
        ))}

        {(!data?.transactions || data.transactions.length === 0) && (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>No transactions yet.</Text>
        )}
      </ScrollView>

      {/* Add Button */}
      <View style={styles.bottomBtnContainer}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddIncome', {
            type: category.categoryType,
            preselectedCategory: category.categoryName
          })}
        >
          <Text style={styles.addBtnText}>
            {category.categoryType === 'expense' ? 'Add Expenses' : 'Add Income'}
          </Text>
        </TouchableOpacity>
      </View>

      <CustomBottomNav activeTab="Stack" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  greenHeaderBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 180, backgroundColor: COLORS.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  actionIcons: { flexDirection: 'row', alignItems: 'center' },
  navIcon: { width: 24, height: 24, tintColor: COLORS.textDark },
  totalCard: { backgroundColor: COLORS.white, marginHorizontal: 20, borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20, elevation: 3 },
  totalLabel: { fontSize: 14, color: COLORS.textLight, marginBottom: 5 },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: COLORS.textDark },
  budgetContainer: { width: '100%', marginTop: 15 },
  progressBarBg: { height: 8, backgroundColor: '#EEE', borderRadius: 4, width: '100%', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  budgetLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  budgetText: { fontSize: 12, color: COLORS.textLight },
  warningText: { color: '#FF4D4D', fontSize: 12, fontWeight: 'bold', marginTop: 2, textAlign: 'center' },
  monthLabel: { paddingHorizontal: 20, marginBottom: 10, fontSize: 14, fontWeight: 'bold', color: COLORS.textDark },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 15, borderRadius: 15, marginHorizontal: 20, marginBottom: 10 },
  iconBox: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rowTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  rowPercent: { fontSize: 12, color: COLORS.textLight },
  rowAmount: { fontSize: 16, fontWeight: 'bold' },
  bottomBtnContainer: { position: 'absolute', bottom: 100, width: '100%', alignItems: 'center' },
  addBtn: { backgroundColor: COLORS.primary, paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
  addBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' }
});

export default CategoryDetailScreen;