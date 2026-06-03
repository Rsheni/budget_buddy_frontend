import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, StatusBar, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import CustomBottomNav from '../../navigation/CustomBottomNav';
import { fetchGroups } from '../../api/groupService';

const { width } = Dimensions.get('window');

const GroupListScreen = ({ navigation }: any) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [totalOwe, setTotalOwe] = useState(0);
  const [totalOwed, setTotalOwed] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadGroups = async () => {
        setLoading(true);
        const data = await fetchGroups();
        setGroups(data);
        
        let owe = 0;
        let owed = 0;
        data.forEach((group: any) => {
           if (group.type === 'owe') owe += (group.youOweAmount || 0);
           if (group.type === 'receive') owed += (group.receiveAmount || 0);
        });
        setTotalOwe(Math.round(owe));
        setTotalOwed(Math.round(owed));
        
        setLoading(false);
      };
      
      loadGroups();
    }, [])
  );
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Groups</Text>
        <TouchableOpacity onPress={() => console.log('Notification pressed')}>
          <Icon name="bell-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Summary Boxes */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryBox, styles.oweBox]}>
            <View style={styles.summaryRow}>
              <Icon name="arrow-down" size={16} color="#3B82F6" />
              <Text style={[styles.summaryLabel, { color: '#3B82F6' }]}>You Owe</Text>
            </View>
            <Text style={[styles.summaryAmount, { color: '#3B82F6' }]}>Rs. {totalOwe.toLocaleString()}</Text>
          </View>

          <View style={[styles.summaryBox, styles.receiveBox]}>
            <View style={styles.summaryRow}>
              <Icon name="arrow-up" size={16} color={COLORS.primary} />
              <Text style={[styles.summaryLabel, { color: COLORS.primary }]}>You are Owed</Text>
            </View>
            <Text style={[styles.summaryAmount, { color: COLORS.primary }]}>Rs. {totalOwed.toLocaleString()}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Active Groups</Text>

        {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : groups.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No active groups yet. Create one!</Text>
        ) : (
            groups.map((group, index) => {
              const bgColors = ['#E6FDF4', '#F0FDF4', '#00C896'];
              const textColors = ['#111827', '#111827', COLORS.white];
              const subTextColors = ['#6B7280', '#6B7280', 'rgba(255,255,255,0.8)'];
              
              const bgColor = bgColors[index % bgColors.length];
              const textColor = textColors[index % textColors.length];
              const subTextColor = subTextColors[index % subTextColors.length];

              return (
                <TouchableOpacity 
                    key={group.id} 
                    style={[styles.groupCard, { backgroundColor: bgColor }]}
                    onPress={() => navigation.navigate('GroupDetail', { group })}
                >
                  {/* Top Row */}
                  <View style={styles.cardTopRow}>
                    <Text style={[styles.groupCreator, { color: index === 0 ? '#00BFA5' : (index === 2 ? COLORS.white : textColor) }]}>
                      {index === 0 ? 'GROUP CREATOR' : group.creator}
                    </Text>
                    
                    {/* Member Avatars */}
                    <View style={styles.avatarContainer}>
                      {group.members && group.members.slice(0, 3).map((m: any, idx: number) => (
                        <Image 
                          key={idx} 
                          source={{ uri: m.profilePicture }} 
                          style={[styles.avatar, { left: idx * -10, zIndex: 3 - idx }]} 
                        />
                      ))}
                      {group.members && group.members.length > 3 && (
                        <View style={[styles.avatarBadge, { left: 3 * -10, zIndex: 0 }]}>
                          <Text style={styles.avatarBadgeText}>+{group.members.length - 3}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Middle Row */}
                  <Text style={[styles.groupName, { color: textColor }]}>{group.name}</Text>

                  {/* Bottom Row */}
                  <View style={styles.cardBottomRow}>
                    <View>
                      <Text style={[styles.statusLabel, { color: subTextColor }]}>
                        {group.type === 'owe' ? 'You Owe' : 'You Should Receive'}
                      </Text>
                      <Text style={[styles.statusAmount, { color: index === 0 ? '#3B82F6' : (index === 1 ? '#00BFA5' : COLORS.white) }]}>
                        Rs. {group.type === 'owe' ? Math.round(group.youOweAmount || 0).toLocaleString() : Math.round(group.receiveAmount || 0).toLocaleString()}
                      </Text>
                    </View>
                    
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.statusLabel, { color: subTextColor }]}>
                        {group.type === 'owe' ? 'Total Group Spend' : 'Received Amount'}
                      </Text>
                      <Text style={[styles.totalAmount, { color: textColor }]}>
                        Rs. {group.type === 'owe' ? Math.round(group.totalSpend || 0).toLocaleString() : Math.round(group.receivedAmount || 0).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
        )}

        {/* Create Group Button */}
        <TouchableOpacity 
          style={styles.createBtn}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Icon name="plus" size={24} color={COLORS.white} />
          <Text style={styles.createBtnText}>Create New Group</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navigation */}
      <CustomBottomNav activeTab="Groups" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Space for Bottom Nav
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  summaryBox: {
    width: '48%',
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
  },
  oweBox: {
    backgroundColor: '#F0F6FF', // Light blue
  },
  receiveBox: {
    backgroundColor: '#E6FDF4', // Light mint green
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 20,
  },
  groupCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  groupCreator: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  avatarBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A7F3D0', // Light green badge
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  avatarBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#065F46',
  },
  groupName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  statusAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createBtn: {
    backgroundColor: '#1F2937', // Dark gray
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 10,
  },
  createBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  }
});

export default GroupListScreen;
