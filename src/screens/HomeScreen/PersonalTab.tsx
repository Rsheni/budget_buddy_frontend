import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import BalanceCard from '../../components/Home/BalanceCard';

const PersonalTab = ({ data }: any) => {
  if (!data) return null;

  return (
    <View style={styles.wrapper}>

      {/* Balance Card uses Real Data */}
      <BalanceCard
        balance={data.balance}
        income={data.totalIncome || 0}
        expense={data.totalExpense || 0}
      />

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {/* Dynamic List */}
        {data.transactions.map((item: any) => (
          <View key={item.id} style={styles.transactionRow}>

            {/* Dynamic Icon & Color */}
            <View style={styles.iconContainer}>
              <View style={[styles.iconBox, { backgroundColor: item.color ? item.color + '20' : '#E8FDF5' }]}>
                {/* Assuming you are using Images now, update logic if using vector icons */}
                {/* If using Image URLs: */}
                {/* <Image 
                    source={{ uri: `https://img.icons8.com/ios/50/${(item.color || '000000').replace('#','')}/${item.icon || 'box'}.png` }} 
                    style={{ width: 24, height: 24, tintColor: item.color }} 
                 /> */}
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.transTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.transDate}>{item.date}</Text>
            </View>

            <View style={styles.tagContainer}>
              <Text style={styles.transTag}>{item.tag}</Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={[styles.transAmount, { color: item.type === 'expense' ? COLORS.textDark : '#007AFF' }]}>
                Rs. {item.amount}
              </Text>
            </View>

          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 80,
  },
  container: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 20,
    marginLeft: 5
  },

  // --- Toggle Switch ---
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8FDF5',
    borderRadius: 15,
    height: 45,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginBottom: 25
  },
  activeToggle: {
    backgroundColor: COLORS.primary,
    height: 35,
    width: '32%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 2
  },
  activeToggleText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  inactiveToggleText: { color: COLORS.textLight, width: '32%', textAlign: 'center', fontSize: 13, fontWeight: '500' },

  // --- ROW STYLING (Strict Grid System) ---
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    // Removed 'justifyContent: space-between' to control spacing manually
  },

  // Col 1: Icon (Fixed 50px)
  iconContainer: {
    width: 50,
    alignItems: 'flex-start' // Aligns icon to left
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#3299FF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Col 2: Text Details (Flexible Width)
  // This column takes up all remaining space between Icon and Tag
  detailsContainer: {
    flex: 1
  },
  transTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2
  },
  transDate: {
    fontSize: 10,
    color: COLORS.blue,
    fontWeight: '500'
  },

  // Col 3: Tag (Fixed 70px) -> Keeps "Monthly", "Pantry", "Rent" aligned vertically
  tagContainer: {
    width: 70,
    alignItems: 'center', // Aligns text to left start of this column
    justifyContent: 'center'
  },
  transTag: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500'
  },

  // Col 4: Amount (Fixed 90px) -> Keeps prices aligned vertically on the right
  amountContainer: {
    width: 95,
    alignItems: 'flex-end', // Aligns text to far right
  },
  transAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark
  }
});

export default PersonalTab;