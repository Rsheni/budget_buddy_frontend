import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { acceptInvitation } from '../../api/groupService';

const SharedTab = ({ data, onRefresh }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [code, setCode] = useState('');
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null);
  const [joining, setJoining] = useState(false);

  if (!data) return <Text>Loading...</Text>;

  const handleAcceptInvitation = async () => {
    if (!code.trim() || code.trim().length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-character code.');
      return;
    }

    setJoining(true);
    try {
      await acceptInvitation(code.trim());
      Alert.alert('Success', 'You have successfully joined the group!');
      setModalVisible(false);
      setCode('');
      setSelectedInvitation(null);
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to accept invitation. Please check the code.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Pending Invitations list at the top */}
        {data.invitations && data.invitations.length > 0 && (
          <View style={styles.invitationSection}>
            <Text style={styles.invitationSectionTitle}>Pending Invitations ({data.invitations.length})</Text>
            {data.invitations.map((inv: any) => (
              <View key={inv.id} style={styles.invitationCard}>
                <View style={styles.invitationInfo}>
                  <View style={styles.invitationIconWrapper}>
                    <Icon name="email-open-outline" size={24} color="#00C896" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.invitationGroupTitle}>Join "{inv.groupName}"</Text>
                    <Text style={styles.invitationInviter}>Invited by {inv.invitedBy}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.joinBtn}
                  onPress={() => {
                    setSelectedInvitation(inv);
                    setCode('');
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.joinBtnText}>Join</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

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

        {/* Accept Invitation Code Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Enter Group Code</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSub}>
                Type the 6-digit code received in email to join "{selectedInvitation?.groupName}".
              </Text>

              <TextInput
                style={styles.codeInput}
                placeholder="e.g. ABC123"
                placeholderTextColor="#9CA3AF"
                value={code}
                onChangeText={(text) => setCode(text.toUpperCase())}
                autoCapitalize="characters"
                maxLength={6}
              />

              <TouchableOpacity 
                style={[styles.modalAcceptBtn, joining && { opacity: 0.7 }]}
                onPress={handleAcceptInvitation}
                disabled={joining}
              >
                {joining ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.modalAcceptBtnText}>Accept & Join Group</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  subValue: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark },

  // Invitation Card & list styles
  invitationSection: {
    marginBottom: 20,
  },
  invitationSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  invitationCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  invitationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  invitationIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  invitationGroupTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  invitationInviter: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  joinBtn: {
    backgroundColor: '#00C896',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  joinBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalSub: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  codeInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalAcceptBtn: {
    backgroundColor: '#00C896',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalAcceptBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default SharedTab;