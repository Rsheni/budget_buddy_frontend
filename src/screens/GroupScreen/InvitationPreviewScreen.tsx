import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';

const InvitationPreviewScreen = ({ route, navigation }: any) => {
    // Get dynamic data from navigation params, or fallback to defaults
    const groupName = route.params?.groupName || 'Vacation';
    const adminName = route.params?.adminName || 'Alex Silva';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={32} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Invitation Preview</Text>
                {/* Placeholder for balance */}
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Email Metadata */}
                <View style={styles.emailMetaContainer}>
                    <Text style={styles.metaText}>
                        <Text style={styles.metaBold}>From: </Text>
                        BudgetBuddy {'<no-reply@budgetbuddy.com>'}
                    </Text>
                    <Text style={styles.metaText}>
                        <Text style={styles.metaBold}>Subject: </Text>
                        {adminName} invited you to join '{groupName}'
                    </Text>
                </View>

                {/* Email Body Card */}
                <View style={styles.emailCard}>
                    
                    {/* Logo Section */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoIcon}>
                            <Icon name="wallet" size={20} color="#1F2937" />
                        </View>
                        <Text style={styles.logoText}>BudgetBuddy</Text>
                    </View>

                    {/* Banner Image */}
                    <Image 
                        source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
                        style={styles.bannerImage}
                    />

                    {/* Title & Description */}
                    <Text style={styles.mainTitle}>Join {adminName} in the '{groupName}' group</Text>
                    
                    <Text style={styles.description}>
                        You've been invited to join the <Text style={styles.cyanTextBold}>{groupName}</Text> group on BudgetBuddy. 
                        Start tracking shared expenses and settling debts easily.
                    </Text>

                    {/* CTA Button */}
                    <TouchableOpacity style={styles.ctaButton}>
                        <Text style={styles.ctaButtonText}>Join Group & Download App</Text>
                    </TouchableOpacity>

                    {/* Features List */}
                    <Text style={styles.featuresTitle}>With BudgetBuddy, you can:</Text>
                    
                    <View style={styles.featureItem}>
                        <View style={styles.checkmarkBox}>
                            <Icon name="check" size={14} color="#1F2937" />
                        </View>
                        <Text style={styles.featureText}>Track shared expenses in real-time</Text>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={styles.checkmarkBox}>
                            <Icon name="check" size={14} color="#1F2937" />
                        </View>
                        <Text style={styles.featureText}>Settle debts with one click</Text>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={styles.checkmarkBox}>
                            <Icon name="check" size={14} color="#1F2937" />
                        </View>
                        <Text style={styles.featureText}>Stay on top of your group budget</Text>
                    </View>

                    {/* Email Footer */}
                    <View style={styles.emailFooter}>
                        <Text style={styles.footerText}>
                            You received this email because {adminName} invited you to BudgetBuddy.
                        </Text>
                        <View style={styles.footerLinks}>
                            <Text style={styles.cyanLink}>Help Center</Text>
                            <Text style={styles.footerDivider}> | </Text>
                            <Text style={styles.cyanLink}>Unsubscribe</Text>
                        </View>
                        <Text style={styles.copyrightText}>© 2024 BUDGETBUDDY INC.</Text>
                    </View>
                </View>
                
            </ScrollView>

            {/* Bottom Floating Info Pill */}
            <View style={styles.bottomPillContainer}>
                <View style={styles.infoPill}>
                    <Icon name="information" size={16} color="#00E5FF" />
                    <Text style={styles.infoPillText}>This is a preview of the outgoing invitation</Text>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Light gray background like mockup
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'ios' ? 20 : 30,
        paddingBottom: 15,
        backgroundColor: '#F9FAFB',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Space for the pill at the bottom
    },
    emailMetaContainer: {
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    metaText: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 4,
    },
    metaBold: {
        fontWeight: 'bold',
        color: '#1F2937',
    },
    emailCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    logoIcon: {
        backgroundColor: '#00E5FF',
        padding: 6,
        borderRadius: 8,
        marginRight: 10,
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    bannerImage: {
        width: '100%',
        height: 160,
        borderRadius: 12,
        marginBottom: 24,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 30,
    },
    description: {
        fontSize: 14,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 25,
    },
    cyanTextBold: {
        color: '#00E5FF',
        fontWeight: 'bold',
    },
    ctaButton: {
        backgroundColor: '#00E5FF', // Bright cyan
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    ctaButtonText: {
        color: '#1F2937', // Dark text on cyan
        fontSize: 15,
        fontWeight: 'bold',
    },
    featuresTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 15,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkmarkBox: {
        width: 20,
        height: 20,
        backgroundColor: '#00E5FF',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    featureText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    emailFooter: {
        marginTop: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 11,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 16,
    },
    footerLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    cyanLink: {
        fontSize: 11,
        color: '#00E5FF',
        fontWeight: 'bold',
    },
    footerDivider: {
        color: '#D1D5DB',
        marginHorizontal: 8,
    },
    copyrightText: {
        fontSize: 10,
        color: '#D1D5DB',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    bottomPillContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    infoPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0F7FA', // Very light cyan background
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#B2EBF2',
    },
    infoPillText: {
        color: '#006064',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 8,
    }
});

export default InvitationPreviewScreen;
