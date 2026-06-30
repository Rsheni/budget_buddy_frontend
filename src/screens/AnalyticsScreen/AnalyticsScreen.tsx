import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Rect, Text as SvgText, Circle, Path } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import {
    fetchAnalyticsSummary,
    fetchCategoryBreakdown,
    fetchCalendarData,
    fetchGroupStats
} from '../../api/analyticsService';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 180;

const FULL_MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart = ({ data }: { data: any[] }) => {
    if (!data || data.length === 0) return <Text style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>No data</Text>;

    const maxVal = Math.max(...data.map(d => Math.max(d.income || 0, d.expense || 0)), 1);
    const barW = Math.min(18, (CHART_WIDTH / data.length) - 8);
    const gap = CHART_WIDTH / data.length;

    return (
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT + 30}>
            {data.map((item, i) => {
                const incomeH = ((item.income || 0) / maxVal) * CHART_HEIGHT;
                const expenseH = ((item.expense || 0) / maxVal) * CHART_HEIGHT;
                const x = i * gap + (gap - barW * 2 - 3) / 2;

                return (
                    <React.Fragment key={i}>
                        {/* Income bar */}
                        <Rect
                            x={x}
                            y={CHART_HEIGHT - incomeH}
                            width={barW}
                            height={Math.max(incomeH, 2)}
                            rx={4}
                            fill="#00C896"
                        />
                        {/* Expense bar */}
                        <Rect
                            x={x + barW + 3}
                            y={CHART_HEIGHT - expenseH}
                            width={barW}
                            height={Math.max(expenseH, 2)}
                            rx={4}
                            fill="#FF6B6B"
                        />
                        {/* Label */}
                        <SvgText
                            x={x + barW}
                            y={CHART_HEIGHT + 18}
                            fontSize={9}
                            fill="#9CA3AF"
                            textAnchor="middle"
                        >
                            {item.label}
                        </SvgText>
                    </React.Fragment>
                );
            })}
        </Svg>
    );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────────
const DonutChart = ({ categories }: { categories: any[] }) => {
    const SIZE = 160;
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    const R = 60;
    const STROKE = 28;

    if (!categories || categories.length === 0) {
        return <Text style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>No data</Text>;
    }

    const total = categories.reduce((s, c) => s + c.amount, 0);
    let cumulative = 0;

    const paths = categories.map((cat, i) => {
        const pct = cat.amount / total;
        const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
        cumulative += pct;
        const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;

        const x1 = CX + R * Math.cos(startAngle);
        const y1 = CY + R * Math.sin(startAngle);
        const x2 = CX + R * Math.cos(endAngle);
        const y2 = CY + R * Math.sin(endAngle);
        const largeArc = pct > 0.5 ? 1 : 0;

        return (
            <Path
                key={i}
                d={`M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={cat.color}
            />
        );
    });

    return (
        <View style={{ alignItems: 'center' }}>
            <Svg width={SIZE} height={SIZE}>
                {paths}
                {/* Center hole */}
                <Circle cx={CX} cy={CY} r={R - STROKE} fill="white" />
                <SvgText x={CX} y={CY - 6} textAnchor="middle" fontSize={10} fill="#6B7280">Total</SvgText>
                <SvgText x={CX} y={CY + 10} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#1F2937">
                    Rs.{(total / 1000).toFixed(1)}k
                </SvgText>
            </Svg>
        </View>
    );
};

// ─── Calendar Heat Map ─────────────────────────────────────────────────────────
const CalendarHeatmap = ({ calData }: { calData: any }) => {
    if (!calData) return null;

    const { daysInMonth, firstDayOfWeek, dayData } = calData;
    const cells: any[] = [];

    // Empty cells before first day
    for (let i = 0; i < firstDayOfWeek; i++) {
        cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(d);
    }

    const dayLabels = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    const cellSize = (SCREEN_WIDTH - 80) / 7;

    return (
        <View>
            {/* Day labels */}
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                {dayLabels.map(l => (
                    <Text key={l} style={[styles.calDayLabel, { width: cellSize }]}>{l}</Text>
                ))}
            </View>
            {/* Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {cells.map((day, idx) => {
                    if (day === null) {
                        return <View key={`empty-${idx}`} style={{ width: cellSize, height: cellSize }} />;
                    }
                    const info = dayData?.[day];
                    const hasExpense = info?.expense > 0;
                    const hasIncome = info?.income > 0;
                    const today = new Date();
                    const isToday = day === today.getDate() &&
                        calData.month === today.getMonth() + 1 &&
                        calData.year === today.getFullYear();

                    return (
                        <View
                            key={day}
                            style={[
                                styles.calCell,
                                { width: cellSize - 4, height: cellSize - 4, margin: 2 },
                                hasExpense && { backgroundColor: '#FFE4E4' },
                                hasIncome && !hasExpense && { backgroundColor: '#DCFCE7' },
                                isToday && { borderWidth: 2, borderColor: '#00C896' }
                            ]}
                        >
                            <Text style={[
                                styles.calDayNum,
                                hasExpense && { color: '#EF4444' },
                                hasIncome && !hasExpense && { color: '#00C896' }
                            ]}>
                                {day}
                            </Text>
                        </View>
                    );
                })}
            </View>
            {/* Legend */}
            <View style={{ flexDirection: 'row', marginTop: 10, gap: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#DCFCE7' }} />
                    <Text style={{ fontSize: 11, color: '#6B7280' }}>Income</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#FFE4E4' }} />
                    <Text style={{ fontSize: 11, color: '#6B7280' }}>Expense</Text>
                </View>
            </View>
        </View>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const AnalyticsScreen = ({ navigation }: any) => {
    const now = new Date();
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
    const [selectedYear] = useState(now.getFullYear());

    const [summary, setSummary] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [calData, setCalData] = useState<any>(null);
    const [groupStats, setGroupStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const [sumData, catData, cal, grp] = await Promise.all([
                fetchAnalyticsSummary(period, selectedMonth + 1, selectedYear),
                fetchCategoryBreakdown(selectedMonth + 1, selectedYear),
                fetchCalendarData(selectedMonth + 1, selectedYear),
                fetchGroupStats()
            ]);
            setSummary(sumData);
            setCategories(catData.categories || []);
            setCalData(cal);
            setGroupStats(grp);
        } catch (e) {
            console.error('Analytics load error:', e);
        } finally {
            setLoading(false);
        }
    }, [period, selectedMonth, selectedYear]);

    useFocusEffect(useCallback(() => { loadAll(); }, [loadAll]));

    const prevMonth = () => {
        if (selectedMonth === 0) return;
        setSelectedMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (selectedMonth === 11) return;
        setSelectedMonth(m => m + 1);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#00C896" barStyle="light-content" />

            {/* ── Header ── */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                        <Icon name="arrow-left" size={22} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Analytics</Text>
                    <TouchableOpacity style={styles.headerBtn}>
                        <Icon name="bell-outline" size={22} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Month Selector */}
                <View style={styles.monthSelector}>
                    <TouchableOpacity onPress={prevMonth} style={styles.monthArrow}>
                        <Icon name="chevron-left" size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.monthLabel}>{FULL_MONTH_NAMES[selectedMonth]} {selectedYear}</Text>
                    <TouchableOpacity onPress={nextMonth} style={styles.monthArrow}>
                        <Icon name="chevron-right" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Period Tabs */}
                <View style={styles.periodTabs}>
                    {(['daily', 'weekly', 'monthly'] as const).map(p => (
                        <TouchableOpacity
                            key={p}
                            style={[styles.periodTab, period === p && styles.periodTabActive]}
                            onPress={() => setPeriod(p)}
                        >
                            <Text style={[styles.periodTabText, period === p && styles.periodTabTextActive]}>
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00C896" />
                    <Text style={{ color: '#9CA3AF', marginTop: 10 }}>Loading analytics...</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Section 1: Summary Cards ── */}
                    <View style={styles.summaryRow}>
                        <View style={[styles.summaryCard, { backgroundColor: '#DCFCE7' }]}>
                            <Icon name="arrow-down-circle" size={24} color="#00C896" />
                            <Text style={styles.summaryCardLabel}>Income</Text>
                            <Text style={[styles.summaryCardAmount, { color: '#00C896' }]}>
                                Rs. {(summary?.totalIncome || 0).toLocaleString()}
                            </Text>
                        </View>
                        <View style={[styles.summaryCard, { backgroundColor: '#FEE2E2' }]}>
                            <Icon name="arrow-up-circle" size={24} color="#EF4444" />
                            <Text style={styles.summaryCardLabel}>Expense</Text>
                            <Text style={[styles.summaryCardAmount, { color: '#EF4444' }]}>
                                Rs. {(summary?.totalExpense || 0).toLocaleString()}
                            </Text>
                        </View>
                        <View style={[styles.summaryCard, { backgroundColor: '#EFF6FF' }]}>
                            <Icon name="piggy-bank" size={24} color="#3B82F6" />
                            <Text style={styles.summaryCardLabel}>Savings</Text>
                            <Text style={[styles.summaryCardAmount, { color: '#3B82F6' }]}>
                                {summary?.savingsRate || 0}%
                            </Text>
                        </View>
                    </View>

                    {/* ── Section 2: Bar Chart ── */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Income vs Expense</Text>
                            <View style={styles.legend}>
                                <View style={[styles.legendDot, { backgroundColor: '#00C896' }]} />
                                <Text style={styles.legendText}>Income</Text>
                                <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
                                <Text style={styles.legendText}>Expense</Text>
                            </View>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <BarChart data={summary?.chartData || []} />
                        </ScrollView>
                    </View>

                    {/* ── Section 3: Savings Rate ── */}
                    <View style={[styles.card, { backgroundColor: '#00C896' }]}>
                        <View style={styles.savingsRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.savingsTitle}>Savings Rate</Text>
                                <Text style={styles.savingsSubtitle}>
                                    {summary?.savingsRate >= 20
                                        ? '🎉 Great job! You\'re saving well.'
                                        : summary?.savingsRate > 0
                                        ? '💡 Try to cut more expenses.'
                                        : '⚠️ Expenses exceed income!'}
                                </Text>
                                <Text style={styles.savingsAmount}>
                                    Net: Rs. {(summary?.netBalance || 0).toLocaleString()}
                                </Text>
                            </View>
                            <View style={styles.savingsRateCircle}>
                                <Text style={styles.savingsRateText}>{summary?.savingsRate || 0}%</Text>
                            </View>
                        </View>
                        {/* Progress bar */}
                        <View style={styles.savingsProgressBg}>
                            <View style={[styles.savingsProgressFill, { width: `${Math.min(summary?.savingsRate || 0, 100)}%` }]} />
                        </View>
                    </View>

                    {/* ── Section 4: Spending by Category ── */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Spending by Category</Text>
                        {categories.length === 0 ? (
                            <Text style={styles.emptyText}>No expense data for this period</Text>
                        ) : (
                            <View style={styles.categoryRow}>
                                <DonutChart categories={categories} />
                                <View style={styles.categoryLegend}>
                                    {categories.slice(0, 5).map((cat, i) => (
                                        <View key={i} style={styles.categoryLegendItem}>
                                            <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                                                <Text style={styles.categoryAmount}>Rs. {cat.amount.toLocaleString()}</Text>
                                            </View>
                                            <Text style={styles.categoryPct}>{cat.percentage}%</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* ── Section 5: Top Categories (ranked bars) ── */}
                    {categories.length > 0 && (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Top Spending Areas</Text>
                            {categories.slice(0, 5).map((cat, i) => (
                                <View key={i} style={styles.topCatRow}>
                                    <View style={styles.topCatRank}>
                                        <Text style={styles.topCatRankText}>#{i + 1}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text style={styles.topCatName}>{cat.name}</Text>
                                            <Text style={styles.topCatAmount}>Rs. {cat.amount.toLocaleString()}</Text>
                                        </View>
                                        <View style={styles.topCatBarBg}>
                                            <View style={[
                                                styles.topCatBarFill,
                                                { width: `${cat.percentage}%`, backgroundColor: cat.color }
                                            ]} />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* ── Section 6: Calendar Heatmap ── */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Spending Calendar</Text>
                        <CalendarHeatmap calData={calData} />
                    </View>

                    {/* ── Section 7: Group Stats ── */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Group Stats</Text>
                        <View style={styles.groupStatsGrid}>
                            <View style={styles.groupStatCard}>
                                <Icon name="account-group" size={24} color="#6366F1" />
                                <Text style={styles.groupStatNum}>{groupStats?.totalGroups || 0}</Text>
                                <Text style={styles.groupStatLabel}>Groups</Text>
                            </View>
                            <View style={styles.groupStatCard}>
                                <Icon name="cash-multiple" size={24} color="#00C896" />
                                <Text style={styles.groupStatNum}>
                                    Rs. {(groupStats?.totalGroupSpend || 0).toLocaleString()}
                                </Text>
                                <Text style={styles.groupStatLabel}>Total Spent</Text>
                            </View>
                            <View style={styles.groupStatCard}>
                                <Icon name="arrow-up" size={24} color="#EF4444" />
                                <Text style={[styles.groupStatNum, { color: '#EF4444' }]}>
                                    Rs. {(groupStats?.youOwe || 0).toLocaleString()}
                                </Text>
                                <Text style={styles.groupStatLabel}>You Owe</Text>
                            </View>
                            <View style={styles.groupStatCard}>
                                <Icon name="arrow-down" size={24} color="#3B82F6" />
                                <Text style={[styles.groupStatNum, { color: '#3B82F6' }]}>
                                    Rs. {(groupStats?.owedToYou || 0).toLocaleString()}
                                </Text>
                                <Text style={styles.groupStatLabel}>Owed to You</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}

            <CustomBottomNav activeTab="Stats" navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },

    // Header
    header: {
        backgroundColor: '#00C896',
        paddingTop: Platform.OS === 'ios' ? 44 : 15,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
    headerBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        gap: 16,
    },
    monthArrow: { padding: 4 },
    monthLabel: { fontSize: 16, fontWeight: '700', color: 'white' },
    periodTabs: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: 4,
    },
    periodTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 16,
    },
    periodTabActive: { backgroundColor: 'white' },
    periodTabText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
    periodTabTextActive: { color: '#00C896' },

    // Loading
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    scrollView: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

    // Summary Row
    summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    summaryCard: {
        flex: 1,
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        gap: 4,
    },
    summaryCardLabel: { fontSize: 11, color: '#4B5563', fontWeight: '600' },
    summaryCardAmount: { fontSize: 13, fontWeight: 'bold' },

    // Cards
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 14 },
    legend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 11, color: '#6B7280', marginRight: 8 },
    emptyText: { color: '#9CA3AF', textAlign: 'center', marginVertical: 20 },

    // Savings Rate Card
    savingsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    savingsTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 4 },
    savingsSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 8 },
    savingsAmount: { fontSize: 14, fontWeight: '700', color: 'white' },
    savingsRateCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    savingsRateText: { fontSize: 20, fontWeight: 'bold', color: 'white' },
    savingsProgressBg: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
    },
    savingsProgressFill: {
        height: 8,
        backgroundColor: 'white',
        borderRadius: 4,
    },

    // Category
    categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    categoryLegend: { flex: 1 },
    categoryLegendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
    categoryDot: { width: 10, height: 10, borderRadius: 5 },
    categoryName: { fontSize: 12, fontWeight: '600', color: '#374151' },
    categoryAmount: { fontSize: 11, color: '#6B7280' },
    categoryPct: { fontSize: 12, fontWeight: 'bold', color: '#374151' },

    // Top Categories
    topCatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
    topCatRank: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topCatRankText: { fontSize: 12, fontWeight: 'bold', color: '#6B7280' },
    topCatName: { fontSize: 13, fontWeight: '600', color: '#1F2937' },
    topCatAmount: { fontSize: 13, fontWeight: 'bold', color: '#374151' },
    topCatBarBg: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 3 },
    topCatBarFill: { height: 6, borderRadius: 3 },

    // Calendar
    calDayLabel: { fontSize: 10, color: '#9CA3AF', textAlign: 'center', fontWeight: '600' },
    calCell: {
        borderRadius: 6,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calDayNum: { fontSize: 11, fontWeight: '600', color: '#6B7280' },

    // Group Stats
    groupStatsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    groupStatCard: {
        width: '47%',
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        gap: 4,
    },
    groupStatNum: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
    groupStatLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600' },
});

export default AnalyticsScreen;
