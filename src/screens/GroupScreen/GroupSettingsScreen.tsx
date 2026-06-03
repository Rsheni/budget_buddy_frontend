import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
    ActivityIndicator,
    Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS } from '../../constants/colors';
import { fetchGroupSettings, updateGroupSettings, addMembersToGroup, removeMemberFromGroup, cancelInvitation, deleteGroup } from '../../api/groupService';
import CustomBottomNav from '../../navigation/CustomBottomNav';
import { useAuth } from '../../context/AuthContext';

const GroupSettingsScreen = ({ route, navigation }: any) => {
    const { user } = useAuth();
    const groupId = route.params?.groupId;

    const [groupName, setGroupName] = useState('');
    const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
    const [originalCoverPhoto, setOriginalCoverPhoto] = useState<string | null>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
    const [memberInput, setMemberInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [adminId, setAdminId] = useState<string | null>(null);

    const [simplifyDebts, setSimplifyDebts] = useState(true);
    const [membersCanInvite, setMembersCanInvite] = useState(true);

    useEffect(() => {
        if (groupId) {
            loadSettings();
        } else {
            Alert.alert('Error', 'No group ID provided');
            navigation.goBack();
        }
    }, [groupId]);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await fetchGroupSettings(groupId);
            setGroupName(data.group.name);
            setAdminId(data.group.adminId);
            if (data.group.coverPhoto) {
                // Ensure correct URL if it's a relative path from the backend
                const photoUrl = data.group.coverPhoto.startsWith('http') 
                    ? data.group.coverPhoto 
                    : `http://localhost:5000/${data.group.coverPhoto}`; // Adjust based on your backend URL handling
                setCoverPhoto(photoUrl);
                setOriginalCoverPhoto(photoUrl);
            }
            setMembers(data.members || []);
            setPendingInvitations(data.pendingInvitations || []);
        } catch (error) {
            Alert.alert('Error', 'Failed to load group settings');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
        });

        if (result.assets && result.assets.length > 0) {
            setCoverPhoto(result.assets[0].uri || null);
        }
    };

    const handleSave = async () => {
        if (!groupName.trim()) {
            Alert.alert('Error', 'Group name cannot be empty');
            return;
        }

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('groupName', groupName);
            
            if (coverPhoto && coverPhoto !== originalCoverPhoto) {
                // @ts-ignore
                formData.append('coverPhoto', {
                    uri: coverPhoto,
                    type: 'image/jpeg',
                    name: 'cover.jpg',
                });
            }

            await updateGroupSettings(groupId, formData);
            Alert.alert('Success', 'Group settings updated successfully');
            loadSettings(); // Reload to get updated data
        } catch (error) {
            Alert.alert('Error', 'Failed to update group settings');
        } finally {
            setSaving(false);
        }
    };

    const handleAddMember = async () => {
        if (!memberInput.trim()) return;
        
        try {
            await addMembersToGroup(groupId, [memberInput.trim()]);
            setMemberInput('');
            Alert.alert('Success', 'Invitation sent!');
            loadSettings(); // Refresh list
        } catch (error) {
            Alert.alert('Error', 'Failed to add member');
        }
    };

    const handleRemoveMember = (memberId: string, isPending: boolean = false) => {
        Alert.alert(
            'Confirm Removal',
            isPending ? 'Are you sure you want to cancel this invitation?' : 'Are you sure you want to remove this member?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: isPending ? 'Cancel Invite' : 'Remove', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (isPending) {
                                await cancelInvitation(groupId, memberId);
                                Alert.alert('Success', 'Invitation cancelled');
                                loadSettings();
                            } else {
                                await removeMemberFromGroup(groupId, memberId);
                                Alert.alert('Success', 'Member removed');
                                if (memberId === (user?.id || user?._id)) {
                                    navigation.navigate('Home');
                                } else {
                                    loadSettings();
                                }
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to remove member');
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteGroup = () => {
        Alert.alert(
            'Delete Group',
            'Are you sure you want to permanently delete this group? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteGroup(groupId);
                            Alert.alert('Success', 'Group deleted');
                            navigation.navigate('Home');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete group');
                        }
                    }
                }
            ]
        );
    };

    const isUserAdmin = adminId === (user?.id || user?._id);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={COLORS.primaryDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Group Settings</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => console.log('Notification pressed')} style={[styles.backButton, { marginRight: 8, width: 36, height: 36, borderRadius: 18 }]}>
                        <Icon name="bell-outline" size={20} color={COLORS.primaryDark} />
                    </TouchableOpacity>
                    {isUserAdmin && (
                        <TouchableOpacity onPress={handleSave} disabled={saving}>
                            {saving ? (
                                <ActivityIndicator color={COLORS.primary} size="small" />
                            ) : (
                                <Text style={styles.saveButton}>Save</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    
                    {/* GROUP INFO */}
                    <Text style={styles.sectionTitle}>GROUP INFO</Text>
                    <View style={styles.card}>
                        <View style={styles.groupInfoRow}>
                            <TouchableOpacity onPress={isUserAdmin ? pickImage : undefined} style={styles.imagePicker} disabled={!isUserAdmin}>
                                {coverPhoto ? (
                                    <Image source={{ uri: coverPhoto }} style={styles.coverImage} />
                                ) : (
                                    <Icon name="camera-plus" size={24} color="#666" />
                                )}
                            </TouchableOpacity>
                            <View style={styles.nameInputContainer}>
                                <Text style={styles.inputLabel}>Group Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={groupName}
                                    onChangeText={setGroupName}
                                    editable={isUserAdmin}
                                />
                            </View>
                        </View>
                    </View>

                    {/* PREFERENCES (Placeholder UI as requested) */}
                    <Text style={styles.sectionTitle}>PREFERENCES</Text>
                    <View style={styles.card}>
                        <View style={styles.preferenceRow}>
                            <View style={styles.preferenceLeft}>
                                <View style={[styles.iconWrapper, { backgroundColor: '#E0F2FE' }]}>
                                    <Icon name="magic-staff" size={20} color="#0EA5E9" />
                                </View>
                                <Text style={styles.preferenceText}>Simplify Debts</Text>
                            </View>
                            <Switch
                                value={simplifyDebts}
                                onValueChange={setSimplifyDebts}
                                trackColor={{ false: '#E5E7EB', true: COLORS.primary }}
                                thumbColor={Platform.OS === 'android' ? COLORS.white : ''}
                                disabled={!isUserAdmin}
                            />
                        </View>
                        <View style={[styles.preferenceRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.preferenceLeft}>
                                <View style={[styles.iconWrapper, { backgroundColor: '#E0F2FE' }]}>
                                    <Icon name="account-multiple-plus" size={20} color="#0EA5E9" />
                                </View>
                                <Text style={styles.preferenceText}>Members can invite</Text>
                            </View>
                            <Switch
                                value={membersCanInvite}
                                onValueChange={setMembersCanInvite}
                                trackColor={{ false: '#E5E7EB', true: COLORS.primary }}
                                thumbColor={Platform.OS === 'android' ? COLORS.white : ''}
                                disabled={!isUserAdmin}
                            />
                        </View>
                    </View>

                    {/* SETTLEMENTS */}
                    <Text style={styles.sectionTitle}>SETTLEMENTS</Text>
                    <View style={styles.card}>
                        <TouchableOpacity 
                            style={[styles.preferenceRow, { borderBottomWidth: 0 }]}
                            onPress={() => navigation.navigate('SettlementHistory', { groupId })}
                            activeOpacity={0.7}
                        >
                            <View style={styles.preferenceLeft}>
                                <View style={[styles.iconWrapper, { backgroundColor: '#E0F9F1' }]}>
                                    <Icon name="history" size={20} color="#00C896" />
                                </View>
                                <Text style={styles.preferenceText}>See Settlement History</Text>
                            </View>
                            <Icon name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* MEMBERS */}
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>MEMBERS</Text>
                    </View>
                    <View style={styles.card}>
                        
                        {/* Add Member Input */}
                        {isUserAdmin && (
                            <View style={{ marginBottom: 20 }}>
                                <View style={styles.inviteInputWrapper}>
                                    <TextInput
                                        style={styles.inviteInput}
                                        placeholder="Email or phone number"
                                        placeholderTextColor="#999"
                                        value={memberInput}
                                        onChangeText={setMemberInput}
                                        onSubmitEditing={handleAddMember}
                                    />
                                    <TouchableOpacity style={styles.addMemberBtn} onPress={handleAddMember}>
                                        <Icon name="plus" size={20} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Accepted Members List */}
                        {members.map((m) => (
                            <View key={m.id} style={styles.memberItem}>
                                <View style={styles.memberInfo}>
                                    <Image source={{ uri: m.profilePicture }} style={styles.memberAvatar} />
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.memberName}>{m.name || m.email}</Text>
                                            {m.isAdmin ? (
                                                <View style={styles.tagAdmin}><Text style={styles.tagTextAdmin}>ADMIN</Text></View>
                                            ) : (
                                                <View style={styles.tagMember}><Text style={styles.tagTextMember}>MEMBER</Text></View>
                                            )}
                                            {m.id === (user?.id || user?._id) && <View style={styles.tagYou}><Text style={styles.tagTextYou}>YOU</Text></View>}
                                        </View>
                                        <Text style={styles.memberDate}>Joined {new Date(m.joinedAt).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                                {(!m.isAdmin && (isUserAdmin || m.id === (user?.id || user?._id))) && (
                                    <TouchableOpacity onPress={() => handleRemoveMember(m.id)}>
                                        <Text style={styles.removeText}>Remove</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}

                        {/* Pending Invitations List */}
                        {pendingInvitations.map((inv) => (
                            <View key={inv.id} style={styles.memberItem}>
                                <View style={styles.memberInfo}>
                                    <View style={[styles.memberAvatar, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
                                        <Icon name="email" size={20} color="#9CA3AF" />
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.memberName}>{inv.emailOrPhone}</Text>
                                            <View style={styles.tagPending}><Text style={styles.tagTextPending}>PENDING</Text></View>
                                        </View>
                                        <Text style={styles.memberDate}>Invited by {inv.invitedBy || 'Admin'}</Text>
                                    </View>
                                </View>
                                {(isUserAdmin) && (
                                    <TouchableOpacity onPress={() => handleRemoveMember(inv.id, true)}>
                                        <Text style={styles.removeText}>Cancel</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* DANGER ZONE */}
                    <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>DANGER ZONE</Text>
                    <View style={[styles.card, { padding: 15 }]}>
                        {!isUserAdmin && (
                            <TouchableOpacity style={styles.dangerButtonOutline} onPress={() => handleRemoveMember((user?.id || user?._id), false)}>
                                <Text style={styles.dangerButtonText}>Leave Group</Text>
                            </TouchableOpacity>
                        )}
                        
                        {isUserAdmin && (
                            <TouchableOpacity style={styles.dangerButtonOutline} onPress={handleDeleteGroup}>
                                <Text style={styles.dangerButtonText}>Delete Group permanently</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                </KeyboardAvoidingView>
            </ScrollView>
            
            <CustomBottomNav activeTab="Groups" navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 20,
        backgroundColor: COLORS.white,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F6FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primaryDark,
    },
    saveButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Room for bottom nav
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#6B7280',
        marginBottom: 8,
        marginLeft: 5,
        marginTop: 15,
        letterSpacing: 0.5,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    groupInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imagePicker: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        overflow: 'hidden',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    nameInputContainer: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    input: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 5,
    },
    preferenceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    preferenceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    preferenceText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1F2937',
    },
    addMemberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    addMemberInput: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 14,
    },
    addMemberBtnSmall: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addMemberBtnText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    inviteInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        borderRadius: 12,
        paddingHorizontal: 10,
    },
    inviteInput: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: COLORS.primaryDark,
    },
    addMemberBtn: {
        backgroundColor: COLORS.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    memberItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    memberName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    memberDate: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    tagAdmin: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    tagTextAdmin: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#6B7280',
    },
    tagYou: {
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    tagTextYou: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0EA5E9',
    },
    tagMember: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    tagTextMember: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#D97706',
    },
    tagPending: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    tagTextPending: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#4B5563',
    },
    removeText: {
        color: '#EF4444',
        fontSize: 13,
        fontWeight: '500',
    },
    subSectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
        marginBottom: 5,
        marginTop: 10,
    },
    dangerButtonOutline: {
        borderWidth: 1,
        borderColor: '#EF4444',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    dangerButtonText: {
        color: '#EF4444',
        fontSize: 15,
        fontWeight: 'bold',
    },
    dangerTextPlain: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: 'bold',
    }
});

export default GroupSettingsScreen;
