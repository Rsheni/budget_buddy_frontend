import React, { useState } from 'react';
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
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS } from '../../constants/colors';
import axios from 'axios';
import { useAuth, API_URL } from '../../context/AuthContext';



const CreateGroupScreen = ({ navigation }: any) => {
    const { token, user } = useAuth();
    const [groupName, setGroupName] = useState('');
    const [memberInput, setMemberInput] = useState('');
    const [members, setMembers] = useState<string[]>([]);
    const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
        });

        if (result.assets && result.assets.length > 0) {
            setCoverPhoto(result.assets[0].uri || null);
        }
    };

    const addMember = () => {
        if (!memberInput.trim()) return;
        // In a real app we might validate email or phone format here
        if (!members.includes(memberInput.trim())) {
            setMembers([...members, memberInput.trim()]);
        }
        setMemberInput('');
    };

    const removeMember = (identifier: string) => {
        setMembers(members.filter(m => m !== identifier));
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            Alert.alert('Error', 'Group name is mandatory');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('groupName', groupName);
            formData.append('members', JSON.stringify(members));

            if (coverPhoto) {
                // @ts-ignore
                formData.append('coverPhoto', {
                    uri: coverPhoto,
                    type: 'image/jpeg',
                    name: 'cover.jpg',
                });
            }

            const response = await axios.post(`${API_URL}/groups/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                Alert.alert('Success', 'Group created successfully');
                
                // Go back to the previous screen upon success
                navigation.goBack();
            }
        } catch (error: any) {
            console.error('Create group error:', error);
            const errorMessage = error.response?.data?.message || 'Something went wrong';
            Alert.alert('Failed to Create Group', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={COLORS.primaryDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create New Group</Text>
                {/* Placeholder for balance */}
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    
                    {/* Add Cover Photo */}
                    <View style={styles.coverPhotoContainer}>
                        <TouchableOpacity style={styles.coverPhotoBtn} onPress={pickImage}>
                            {coverPhoto ? (
                                <Image source={{ uri: coverPhoto }} style={styles.coverImage} />
                            ) : (
                                <>
                                    <Icon name="camera-plus" size={40} color={COLORS.primary} />
                                    <Text style={styles.coverPhotoText}>Add Group Cover</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Group Name */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Group Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Summer Trip 2024"
                            placeholderTextColor="#999"
                            value={groupName}
                            onChangeText={setGroupName}
                        />
                    </View>



                    {/* Invite Members */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inviteHeader}>
                            <Text style={styles.label}>Invite Members</Text>
                            <Text style={styles.optionalText}>OPTIONAL</Text>
                        </View>
                        
                        <View style={styles.inviteInputWrapper}>
                            <TextInput
                                style={styles.inviteInput}
                                placeholder="Email or phone number"
                                placeholderTextColor="#999"
                                value={memberInput}
                                onChangeText={setMemberInput}
                                onSubmitEditing={addMember}
                            />
                            <TouchableOpacity style={styles.addMemberBtn} onPress={addMember}>
                                <Icon name="plus" size={20} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>

                        {/* Members List */}
                        <View style={styles.membersList}>
                            {/* Always include 'You' */}
                            <View style={styles.memberBadge}>
                                <View style={styles.avatarPlaceholder}>
                                    <Icon name="account" size={16} color="#666" />
                                </View>
                                <Text style={styles.memberName}>You</Text>
                            </View>

                            {members.map((m, idx) => (
                                <View key={idx} style={styles.memberBadge}>
                                    <View style={styles.avatarPlaceholder}>
                                        <Text style={styles.avatarInitial}>{m.charAt(0).toUpperCase()}</Text>
                                    </View>
                                    <Text style={styles.memberName}>{m}</Text>
                                    <TouchableOpacity onPress={() => removeMember(m)} style={styles.removeMemberBtn}>
                                        <Icon name="close-circle" size={16} color="#999" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Create Button */}
                    <TouchableOpacity 
                        style={styles.createButton} 
                        onPress={handleCreateGroup}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <>
                                <Text style={styles.createButtonText}>Create Group</Text>
                                <Icon name="check-circle" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
                            </>
                        )}
                    </TouchableOpacity>

                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
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
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    coverPhotoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    coverPhotoBtn: {
        width: 120,
        height: 120,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    coverPhotoText: {
        color: COLORS.primary,
        fontSize: 12,
        marginTop: 8,
    },
    inputContainer: {
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primaryDark,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#F5F6FA',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 15,
        fontSize: 16,
        color: COLORS.primaryDark,
    },

    inviteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionalText: {
        fontSize: 11,
        color: '#999',
        fontWeight: 'bold',
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
    membersList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15,
        gap: 10,
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    avatarPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    avatarInitial: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
    },
    memberName: {
        fontSize: 13,
        color: COLORS.primaryDark,
        fontWeight: '500',
    },
    removeMemberBtn: {
        marginLeft: 6,
    },
    createButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        flexDirection: 'row',
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    createButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default CreateGroupScreen;
