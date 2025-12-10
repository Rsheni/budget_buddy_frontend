import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';

const SharedTab = ({ data }: any) => {
  if (!data) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
        <View style={styles.oweContainer}>
            <View style={styles.oweBox}>
                <Text style={styles.oweLabel}>You Owe</Text>
                <Text style={styles.oweAmount}>Rs. {data.youOwe}</Text>
            </View>
            <View style={styles.oweBox}>
                <Text style={styles.oweLabel}>Owe You</Text>
                <Text style={styles.oweAmount}>Rs. {data.owedToYou}</Text>
            </View>
        </View>

        {data.groups.map((group: any) => (
            <View key={group.id} style={styles.groupCard}>
                <Text style={styles.roleText}>{group.role}</Text>
                <Text style={styles.groupName}>{group.name}</Text>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.subLabel}>You Owe</Text>
                        <Text style={styles.subValue}>Rs. {group.userOwes}</Text>
                    </View>
                    <View>
                        <Text style={styles.subLabel}>Total/Received</Text>
                        <Text style={styles.subValue}>Rs. {group.totalSpend || group.received}</Text>
                    </View>
                </View>
            </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  oweContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  oweBox: { backgroundColor: COLORS.white, width: '48%', padding: 20, borderRadius: 20 },
  oweLabel: { fontSize: 12, color: COLORS.textMedium },
  oweAmount: { fontSize: 20, fontWeight: 'bold', color: COLORS.darkBlue },
  groupCard: { backgroundColor: COLORS.cardBackground, padding: 20, borderRadius: 20, marginBottom: 15 },
  roleText: { color: COLORS.blue, fontSize: 12, marginBottom: 2 },
  groupName: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  subLabel: { fontSize: 12, color: COLORS.textMedium },
  subValue: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark }
});

export default SharedTab;