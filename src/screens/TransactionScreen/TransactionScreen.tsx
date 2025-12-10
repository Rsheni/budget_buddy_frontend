import React, { useState, useCallback } from 'react'; // Added useCallback
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Added useFocusEffect
import { COLORS } from '../../constants/colors';
import BalanceCard from '../../components/Home/BalanceCard';
import { fetchIncomes } from '../../api/transactionService';

const TransactionScreen = () => {
  const navigation = useNavigation<any>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // THIS IS THE KEY FIX: useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        const result = await fetchIncomes();
        setData(result);
        setLoading(false);
      };
      load();
    }, []) // Dependencies array stays empty
  );

  return (
    <View style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
           <TouchableOpacity onPress={() => navigation.goBack()}>
             <Image source={{ uri: 'https://img.icons8.com/ios/50/ffffff/left.png' }} style={styles.navIcon} />
           </TouchableOpacity>
           <Text style={styles.headerTitle}>Transaction</Text>
           <View style={styles.navIcon}><Text>🔔</Text></View>
        </View>
        <BalanceCard balance={data?.balance || 0} income={data?.totalIncome || 0} expense={0} />
      </View>

      {/* 2. Income/Expense Summary Boxes */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryBox, { backgroundColor: COLORS.blue }]}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryValue}>Rs. {data?.totalIncome || 0}</Text>
        </View>
        <View style={[styles.summaryBox, { backgroundColor: COLORS.white }]}>
            <Text style={[styles.summaryLabel, { color: COLORS.textDark }]}>Expense</Text>
            <Text style={[styles.summaryValue, { color: COLORS.textDark }]}>Rs. 0</Text>
        </View>
      </View>

      {/* 3. List Content */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
            <Text style={styles.monthText}>Recent Transactions</Text>
            <Image source={{ uri: 'https://img.icons8.com/ios/50/00D09E/calendar.png' }} style={{ width: 24, height: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {data?.transactions?.map((item: any) => (
            <View key={item._id} style={styles.row}>
                <View style={styles.iconBox}><Text>💰</Text></View>
                <View style={{flex: 1}}>
                    <Text style={styles.rowTitle}>{item.description}</Text>
                    <Text style={styles.rowPercent}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.rowAmount}>Rs. {item.amount}</Text>
            </View>
          ))}
          {/* Show message if list is empty */}
          {(!data?.transactions || data.transactions.length === 0) && (
             <Text style={{textAlign: 'center', marginTop: 20, color: '#888'}}>No records found.</Text>
          )}
        </ScrollView>
      </View>

      {/* 4. FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddIncome')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  navIcon: { width: 24, height: 24 },
  
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30, marginTop: -30 },
  summaryBox: { width: '45%', padding: 15, borderRadius: 20, elevation: 5, alignItems: 'center' },
  summaryLabel: { color: COLORS.white, fontSize: 12 },
  summaryValue: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },

  listContainer: { flex: 1, paddingHorizontal: 30, marginTop: 20 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  monthText: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 15, borderRadius: 15, marginBottom: 10 },
  iconBox: { width: 40, height: 40, backgroundColor: COLORS.lightBlue, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rowTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  rowPercent: { fontSize: 12, color: COLORS.textLight },
  rowAmount: { fontSize: 16, fontWeight: 'bold', color: COLORS.blue },

  fab: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: 60,
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    borderWidth: 4,
    borderColor: COLORS.white
  },
  fabText: { fontSize: 30, color: COLORS.white, marginTop: -2 }
});

export default TransactionScreen;