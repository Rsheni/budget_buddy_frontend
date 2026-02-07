// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { COLORS } from '../../constants/colors';
// import { fetchTransactions } from '../../api/transactionService'; // Use fetchTransactions
// import CustomBottomNav from '../../navigation/CustomBottomNav';

// const TransactionScreen = () => {
//   const navigation = useNavigation<any>();
//   const [data, setData] = useState<any>(null);

//   // Toggle for List View (Income vs Expense List)
//   const [viewType, setViewType] = useState<'income' | 'expense'>('income');

//   // Date State for List Filtering
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);

//   useFocusEffect(
//     useCallback(() => {
//       const load = async () => {
//         // 1. Get Filter Params
//         const month = currentDate.getMonth() + 1; 
//         const year = currentDate.getFullYear();

//         // 2. Fetch Data (Passes viewType to filter the list)
//         const result = await fetchTransactions(month, year, viewType);
//         setData(result);
//       };
//       load();
//     }, [currentDate, viewType])
//   );

//   const onDateChange = (event: any, selectedDate?: Date) => {
//     setShowPicker(false);
//     if (selectedDate) {
//       setCurrentDate(selectedDate);
//     }
//   };

//   const isExpense = viewType === 'expense';

//   return (
//     <View style={styles.container}>

//       {/* --- HEADER (DASHBOARD - ALWAYS CURRENT MONTH) --- */}
//       <View style={styles.header}>
//         <View style={styles.topRow}>
//            <TouchableOpacity onPress={() => navigation.goBack()}>
//              <Image source={{ uri: 'https://img.icons8.com/ios/50/093030/left.png' }} style={styles.navIcon} />
//            </TouchableOpacity>
//            <Text style={styles.headerTitle}>Transaction</Text>
//            <View style={styles.navIcon}><Text style={{fontSize: 20}}>🔔</Text></View>
//         </View>

//         {/* 1. BALANCE (Real-Time Current Month Balance) */}
//         <View style={styles.balanceContainer}>
//             <Text style={styles.balanceLabel}>Current Balance Of Your Wallet</Text>
//             {/* Always shows Current Month Income - Current Month Expense */}
//             <Text style={styles.balanceAmount}>
//                 Rs. {data?.balance?.toLocaleString() || "0"}
//             </Text>

//             <View style={styles.progressBarBg}>
//                 <View style={styles.progressPill}><Text style={styles.progressText}>30%</Text></View>
//                 {/* Shows Current Month Income Target */}
//                 <Text style={styles.targetText}>Rs. {data?.currentMonthIncome?.toLocaleString() || "0"}</Text>
//             </View>
//         </View>

//         {/* 2. STATS CARDS (Real-Time Current Month Totals) */}
//         <View style={styles.statsRow}>

//             {/* Income Card */}
//             <TouchableOpacity 
//                 style={[styles.statCard, { backgroundColor: isExpense ? COLORS.white : COLORS.blue }]}
//                 onPress={() => setViewType('income')}
//             >
//                 <View style={[styles.statIconCircle, { backgroundColor: isExpense ? COLORS.blue : 'rgba(255,255,255,0.2)' }]}>
//                     <Image source={{ uri: 'https://img.icons8.com/ios/50/ffffff/down-left.png' }} style={{ width: 20, height: 20 }} />
//                 </View>
//                 <Text style={[styles.statLabel, { color: isExpense ? COLORS.textDark : COLORS.white }]}>Income</Text>

//                 {/* ALWAYS show Current Month Income Amount */}
//                 <Text style={[styles.statAmount, { color: isExpense ? COLORS.blue : COLORS.white }]}>
//                     Rs. {data?.currentMonthIncome?.toLocaleString() || "0"}
//                 </Text>
//             </TouchableOpacity>

//             {/* Expense Card */}
//             <TouchableOpacity 
//                 style={[styles.statCard, { backgroundColor: isExpense ? COLORS.blue : COLORS.white }]}
//                 onPress={() => setViewType('expense')}
//             >
//                 <View style={[styles.statIconCircle, { backgroundColor: isExpense ? 'rgba(255,255,255,0.2)' : COLORS.blue }]}>
//                     <Image source={{ uri: 'https://img.icons8.com/ios/50/ffffff/up-right.png' }} style={{ width: 20, height: 20 }} />
//                 </View>
//                 <Text style={[styles.statLabel, { color: isExpense ? COLORS.white : COLORS.textDark }]}>Expense</Text>

//                 {/* ALWAYS show Current Month Expense Amount */}
//                 <Text style={[styles.statAmount, { color: isExpense ? COLORS.white : COLORS.blue }]}>
//                     Rs. {data?.currentMonthExpense?.toLocaleString() || "0"}
//                 </Text>
//             </TouchableOpacity>
//         </View>

//       </View>

//       {/* --- LIST CONTENT (FILTERED HISTORY) --- */}
//       <View style={styles.listContainer}>

//         {/* Date Filter */}
//         <View style={styles.filterSection}>
//             <Text style={styles.filterLabel}>Month</Text>
//             <TouchableOpacity style={styles.dateSelector} onPress={() => setShowPicker(true)}>
//                 <Text style={styles.dateText}>
//                     {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                 </Text>
//                 <Image source={{ uri: 'https://img.icons8.com/ios/50/00D09E/calendar.png' }} style={{ width: 24, height: 24, marginLeft: 10 }} />
//             </TouchableOpacity>
//         </View>

//         {showPicker && <DateTimePicker value={currentDate} mode="date" display="default" onChange={onDateChange} />}

//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
//           {data?.transactions?.map((item: any) => (
//             <TouchableOpacity 
//                 key={item._id} 
//                 style={styles.row}
//                 onPress={() => navigation.navigate('AddIncome', { incomeToEdit: item, type: viewType })}
//             >
//                 <View style={styles.iconBox}><Text style={{fontSize: 22}}>{isExpense ? '💸' : '💰'}</Text></View>
//                 <View style={{flex: 1}}>
//                     <Text style={styles.rowTitle}>{item.description}</Text>
//                     <Text style={styles.rowPercent}>{new Date(item.date).toLocaleDateString()}</Text>
//                 </View>

//                 {/* Removed Negative Sign '-'. Color is Dark for Income, Red for Expense */}
//                 <Text style={[styles.rowAmount, isExpense && { color: '#FF4D4D' }]}>
//                     Rs. {item.amount}
//                 </Text>
//             </TouchableOpacity>
//           ))}

//           {(!data?.transactions || data.transactions.length === 0) && (
//              <Text style={{textAlign: 'center', marginTop: 30, color: '#888'}}>
//                 No {viewType} records found.
//              </Text>
//           )}
//         </ScrollView>
//       </View>

//       {/* FAB */}
//       <TouchableOpacity 
//         style={styles.fab} 
//         onPress={() => navigation.navigate('AddIncome', { type: viewType })}
//       >
//         <Text style={styles.fabText}>+</Text>
//       </TouchableOpacity>

//       <CustomBottomNav activeTab="Swap" navigation={navigation} />

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.background },
//   header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingHorizontal: 25, paddingBottom: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
//   topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
//   headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
//   navIcon: { width: 24, height: 24, tintColor: COLORS.textDark },

//   balanceContainer: { marginBottom: 25 },
//   balanceLabel: { fontSize: 13, color: COLORS.textDark, fontWeight: '500', marginBottom: 5 },
//   balanceAmount: { fontSize: 32, fontWeight: 'bold', color: COLORS.blue, marginBottom: 15 },
//   progressBarBg: { height: 35, backgroundColor: '#1E1E1E', borderRadius: 17.5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, justifyContent: 'space-between' },
//   progressPill: { backgroundColor: COLORS.white, paddingHorizontal: 12, height: 25, borderRadius: 12.5, justifyContent: 'center' },
//   progressText: { fontSize: 12, fontWeight: 'bold', color: COLORS.textDark },
//   targetText: { color: COLORS.white, fontSize: 12, marginRight: 10 },

//   statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   statCard: { width: '48%', padding: 15, borderRadius: 20, alignItems: 'center', elevation: 3 },
//   statIconCircle: { width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
//   statLabel: { fontSize: 12, marginBottom: 2, fontWeight: 'bold' },
//   statAmount: { fontSize: 18, fontWeight: 'bold' },

//   listContainer: { flex: 1, paddingHorizontal: 25, marginTop: 20 },
//   filterSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
//   filterLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
//   dateSelector: { flexDirection: 'row', alignItems: 'center' },
//   dateText: { fontSize: 16, color: COLORS.textDark, fontWeight: '500' },

//   row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 15, borderRadius: 15, marginBottom: 10 },
//   iconBox: { width: 45, height: 45, backgroundColor: COLORS.lightBlue, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
//   rowTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
//   rowPercent: { fontSize: 12, color: COLORS.textLight },
//   rowAmount: { fontSize: 16, fontWeight: 'bold', color: COLORS.blue },

//   fab: { position: 'absolute', bottom: 110, alignSelf: 'center', width: 60, height: 60, backgroundColor: COLORS.primary, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 10, borderWidth: 4, borderColor: COLORS.white },
//   fabText: { fontSize: 30, color: COLORS.white, marginTop: -2 }
// });

// export default TransactionScreen;


import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/colors';
import { fetchTransactions } from '../../api/transactionService';
import CustomBottomNav from '../../navigation/CustomBottomNav';
import BalanceCard from '../../components/Home/BalanceCard';

const TransactionScreen = () => {
  const navigation = useNavigation<any>();
  const [data, setData] = useState<any>(null);

  // Toggle for List View (Income vs Expense List)
  const [viewType, setViewType] = useState<'income' | 'expense'>('income');

  // Date State for List Filtering
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Search State
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        // 1. Get Filter Params
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        // 2. Fetch Data (Passes viewType + Search to filter the list)
        const result = await fetchTransactions(month, year, viewType, undefined, searchText);
        setData(result);
      };
      load();
    }, [currentDate, viewType, searchText])
  );

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  };

  const isExpense = viewType === 'expense';

  // Calculate Savings Percentage
  const income = data?.currentMonthIncome || 0;
  const expense = data?.currentMonthExpense || 0;
  const balance = income - expense;
  const savingsPercent = income > 0 ? Math.max(0, Math.min(100, Math.round((balance / income) * 100))) : 0;

  return (
    <View style={styles.container}>

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={{ uri: 'https://img.icons8.com/ios/50/093030/left.png' }} style={styles.navIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction</Text>
          <View style={styles.navIcon}><Text style={{ fontSize: 20 }}>🔔</Text></View>
        </View>

        {/* BALANCE */}
        <BalanceCard
          balance={data?.balance || 0}
          income={data?.currentMonthIncome || 0}
          expense={data?.currentMonthExpense || 0}
        />

        {/* STATS CARDS */}
        <View style={styles.statsRow}>
          {/* Income Card */}
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: isExpense ? COLORS.white : COLORS.blue }]}
            onPress={() => setViewType('income')}
          >
            <View style={[styles.statIconCircle, { backgroundColor: isExpense ? COLORS.blue : 'rgba(255,255,255,0.2)' }]}>
              <Image source={{ uri: 'https://img.icons8.com/ios/50/ffffff/down-left.png' }} style={{ width: 20, height: 20 }} />
            </View>
            <Text style={[styles.statLabel, { color: isExpense ? COLORS.textDark : COLORS.white }]}>Income</Text>
            <Text style={[styles.statAmount, { color: isExpense ? COLORS.blue : COLORS.white }]}>
              Rs. {data?.currentMonthIncome?.toLocaleString() || "0"}
            </Text>
          </TouchableOpacity>

          {/* Expense Card */}
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: isExpense ? COLORS.blue : COLORS.white }]}
            onPress={() => setViewType('expense')}
          >
            <View style={[styles.statIconCircle, { backgroundColor: isExpense ? 'rgba(255,255,255,0.2)' : COLORS.blue }]}>
              <Image source={{ uri: 'https://img.icons8.com/ios/50/ffffff/up-right.png' }} style={{ width: 20, height: 20 }} />
            </View>
            <Text style={[styles.statLabel, { color: isExpense ? COLORS.white : COLORS.textDark }]}>Expense</Text>
            <Text style={[styles.statAmount, { color: isExpense ? COLORS.white : COLORS.blue }]}>
              Rs. {data?.currentMonthExpense?.toLocaleString() || "0"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- LIST CONTENT --- */}
      <View style={styles.listContainer}>

        {/* SEARCH & FILTER ROW (Replaced Icon with Image) */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            {/* Search Icon */}
            <Image source={{ uri: 'https://img.icons8.com/ios/50/898989/search.png' }} style={{ width: 20, height: 20 }} />
            <TextInput
              placeholder="Search..."
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            {/* Filter Icon */}
            <Image source={{ uri: 'https://img.icons8.com/ios/50/00D09E/filter.png' }} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>

        {/* Date Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Month</Text>
          <TouchableOpacity style={styles.dateSelector} onPress={() => setShowPicker(true)}>
            <Text style={styles.dateText}>
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            {/* Calendar Icon */}
            <Image source={{ uri: 'https://img.icons8.com/ios/50/00D09E/calendar.png' }} style={{ width: 24, height: 24, marginLeft: 10 }} />
          </TouchableOpacity>
        </View>

        {showPicker && <DateTimePicker value={currentDate} mode="date" display="default" onChange={onDateChange} />}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          {data?.transactions?.map((item: any) => {
            // Date Formatting
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            return (
              <TouchableOpacity
                key={item._id}
                style={styles.row}
                onPress={() => navigation.navigate('AddIncome', { incomeToEdit: item, type: viewType })}
              >
                <View style={styles.iconBox}><Text style={{ fontSize: 22 }}>{isExpense ? '💸' : '💰'}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{item.description}</Text>
                  {/* Date - Time Format */}
                  <Text style={styles.rowPercent}>{`${dateStr} - ${timeStr}`}</Text>
                  <View style={{ flexDirection: 'row', marginTop: 2 }}>
                    {item.isRecurring && <Text style={{ fontSize: 10, color: COLORS.primary, marginRight: 8 }}>↻ {item.recurringFrequency}</Text>}
                    {item.receiptUrl ? <Text style={{ fontSize: 10, color: COLORS.blue }}>📎 Bill Attached</Text> : null}
                  </View>
                </View>

                {/* Amount: Black Color, Minus for Expense */}
                <Text style={[styles.rowAmount, { color: COLORS.textDark }]}>
                  {isExpense ? '- ' : ''}Rs. {item.amount}
                </Text>
              </TouchableOpacity>
            );
          })}

          {(!data?.transactions || data.transactions.length === 0) && (
            <Text style={{ textAlign: 'center', marginTop: 30, color: '#888' }}>
              No {viewType} records found.
            </Text>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddIncome', { type: viewType })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <CustomBottomNav activeTab="Swap" navigation={navigation} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingHorizontal: 25, paddingBottom: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  navIcon: { width: 24, height: 24, tintColor: COLORS.textDark },

  balanceContainer: { marginBottom: 25 },
  balanceLabel: { fontSize: 13, color: COLORS.textDark, fontWeight: '500', marginBottom: 5 },
  balanceAmount: { fontSize: 32, fontWeight: 'bold', color: COLORS.blue, marginBottom: 15 },
  progressBarBg: { height: 35, backgroundColor: '#1E1E1E', borderRadius: 17.5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, justifyContent: 'space-between' },
  progressPill: { backgroundColor: COLORS.white, paddingHorizontal: 12, height: 25, borderRadius: 12.5, justifyContent: 'center' },
  progressText: { fontSize: 12, fontWeight: 'bold', color: COLORS.textDark },
  targetText: { color: COLORS.white, fontSize: 12, marginRight: 10 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { width: '48%', padding: 15, borderRadius: 20, alignItems: 'center', elevation: 3 },
  statIconCircle: { width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statLabel: { fontSize: 12, marginBottom: 2, fontWeight: 'bold' },
  statAmount: { fontSize: 18, fontWeight: 'bold' },

  listContainer: { flex: 1, paddingHorizontal: 25, marginTop: 20 },

  // Search & Filter Styles
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 15, paddingHorizontal: 15, height: 45, marginRight: 10 },
  searchInput: { flex: 1, marginLeft: 10, color: COLORS.textDark },
  filterBtn: { width: 45, height: 45, backgroundColor: COLORS.white, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },

  filterSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  filterLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  dateSelector: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 16, color: COLORS.textDark, fontWeight: '500' },

  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 15, borderRadius: 15, marginBottom: 10 },
  iconBox: { width: 45, height: 45, backgroundColor: COLORS.lightBlue, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rowTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  rowPercent: { fontSize: 12, color: COLORS.textLight },
  rowAmount: { fontSize: 16, fontWeight: 'bold', color: COLORS.blue },

  fab: { position: 'absolute', bottom: 110, alignSelf: 'center', width: 60, height: 60, backgroundColor: COLORS.primary, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 10, borderWidth: 4, borderColor: COLORS.white },
  fabText: { fontSize: 30, color: COLORS.white, marginTop: -2 }
});

export default TransactionScreen;