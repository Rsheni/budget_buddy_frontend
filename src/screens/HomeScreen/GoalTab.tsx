import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

const GoalTab = ({ data }: any) => {
  if (!data) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
       <View style={styles.summaryCard}>
          <Text style={styles.label}>Amount of Saving</Text>
          <Text style={styles.amount}>Rs. {data.totalSavings.toLocaleString()}</Text>
       </View>

       {data.list.map((item: any) => (
         <View key={item.id} style={styles.goalCard}>
            <View style={styles.iconBox}><Text>{item.icon}</Text></View>
            <View style={styles.info}>
                <Text style={styles.goalName}>{item.name}</Text>
                {/* Simple Progress Bar */}
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${(item.current / item.target) * 100}%` }]} />
                </View>
            </View>
            <Text style={styles.goalAmount}>Rs. {item.current}</Text>
         </View>
       ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  summaryCard: { alignItems: 'center', marginBottom: 30 },
  label: { fontSize: 14, color: COLORS.textMedium },
  amount: { fontSize: 32, fontWeight: 'bold', color: COLORS.darkBlue, marginTop: 5 },
  goalCard: {
      backgroundColor: COLORS.cardBackground, padding: 20, borderRadius: 20, marginBottom: 15,
      flexDirection: 'row', alignItems: 'center'
  },
  iconBox: { width: 40, height: 40, backgroundColor: COLORS.blue, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  info: { flex: 1 },
  goalName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMedium, marginBottom: 5 },
  progressBarBg: { height: 6, backgroundColor: COLORS.white, borderRadius: 3, width: '100%' },
  progressBarFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  goalAmount: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMedium, marginLeft: 10 }
});

export default GoalTab;