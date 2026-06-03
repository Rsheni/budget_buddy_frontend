import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../constants/config';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

const CreateGoalScreen = ({ navigation }: any) => {
  const { token } = useAuth();
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Travel');
  const [priority, setPriority] = useState('Medium');
  const [includeTargetDate, setIncludeTargetDate] = useState(true);
  const [date, setDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 6, new Date().getDate()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleCreateGoal = async () => {
    if (!goalName || !targetAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/goals/add`, {
        goalName,
        targetAmount: parseFloat(targetAmount),
        priority: priority.toLowerCase(),
        category: selectedCategory,
        targetDate: includeTargetDate ? date.toISOString() : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Success', 'Goal created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Error creating goal:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Travel', icon: 'airplane-outline', color: '#00D09E' },
    { name: 'Tech', icon: 'laptop-outline', color: '#9BA4B5' },
    { name: 'Car', icon: 'car-outline', color: '#9BA4B5' },
    { name: 'Home', icon: 'home-outline', color: '#9BA4B5' },
    { name: 'General', icon: 'wallet-outline', color: '#9BA4B5' },
  ];

  const priorities = ['Low', 'Medium', 'High'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Goal</Text>
        <TouchableOpacity onPress={() => console.log('Notification pressed')}>
          <Icon name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Goal Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Goal Name</Text>
          <View style={styles.textInputContainer}>
            <TextInput 
              style={styles.textInput}
              value={goalName}
              onChangeText={setGoalName}
              placeholder="e.g., Emergency Fund"
              placeholderTextColor="#9BA4B5"
            />
          </View>
        </View>

        {/* Target Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Target Amount</Text>
          <View style={[styles.textInputContainer, { paddingRight: 15 }]}>
            <Text style={styles.currencyPrefix}>Rs. </Text>
            <TextInput 
              style={styles.textInput}
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholder="0.00"
              placeholderTextColor="#9BA4B5"
              keyboardType="numeric"
            />
            <Icon name="wallet-outline" size={20} color="#9BA4B5" />
          </View>
        </View>

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryRow}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <TouchableOpacity 
                  key={cat.name} 
                  style={styles.categoryItem}
                  onPress={() => setSelectedCategory(cat.name)}
                >
                  <View style={[styles.categoryIcon, isSelected && styles.selectedCategoryIcon]}>
                    <Icon name={cat.icon} size={20} color={isSelected ? '#FFF' : '#333'} />
                  </View>
                  <Text style={[styles.categoryName, isSelected && styles.selectedCategoryName]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Priority Level */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority Level</Text>
          <View style={styles.priorityRow}>
            {priorities.map((p) => {
              const isSelected = priority === p;
              return (
                <TouchableOpacity 
                  key={p} 
                  style={[styles.priorityButton, isSelected && styles.selectedPriorityButton]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityText, isSelected && styles.selectedPriorityText]}>{p}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Target Date Section */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Target Date</Text>
            <TouchableOpacity 
              style={styles.toggleRow} 
              onPress={() => setIncludeTargetDate(!includeTargetDate)}
            >
              <Text style={styles.toggleText}>{includeTargetDate ? 'Included' : 'Skip'}</Text>
              <Icon 
                name={includeTargetDate ? 'checkbox' : 'square-outline'} 
                size={20} 
                color={includeTargetDate ? '#00D09E' : '#9BA4B5'} 
              />
            </TouchableOpacity>
          </View>
          
          {includeTargetDate && (
            <TouchableOpacity 
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar-outline" size={24} color="#00D09E" />
              <View style={styles.dateInfo}>
                <Text style={styles.dateValueText}>{date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                <Text style={styles.dateLabelText}>Tap to change</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#9BA4B5" />
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}

          {!includeTargetDate && (
            <View style={styles.skippedContainer}>
              <Text style={styles.skippedText}>No deadline set for this goal.</Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.createButton, loading && { opacity: 0.7 }]} 
          onPress={handleCreateGoal}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Create Goal'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 12,
    color: '#333',
    fontWeight: '700',
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 12,
    color: '#9BA4B5',
    marginRight: 6,
    fontWeight: '600',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  dateInfo: {
    flex: 1,
    marginLeft: 15,
  },
  dateValueText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '700',
  },
  dateLabelText: {
    fontSize: 11,
    color: '#9BA4B5',
    fontWeight: '500',
    marginTop: 2,
  },
  skippedContainer: {
    height: 100,
    backgroundColor: '#F5F7FA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderStyle: 'dashed',
  },
  skippedText: {
    fontSize: 13,
    color: '#9BA4B5',
    fontWeight: '500',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 60,
  },
  currencyPrefix: {
    fontSize: 14,
    color: '#9BA4B5',
    fontWeight: '600',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedCategoryIcon: {
    backgroundColor: '#00D09E',
  },
  categoryName: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
  },
  selectedCategoryName: {
    color: '#333',
  },
  priorityRow: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#F5F7FA',
    padding: 4,
  },
  priorityButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPriorityButton: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  priorityText: {
    fontSize: 14,
    color: '#9BA4B5',
    fontWeight: '600',
  },
  selectedPriorityText: {
    color: '#00D09E',
  },
  calendarContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarMonth: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  calendarDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: '#333',
    fontWeight: '700',
  },
  calendarDatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: (width - 100) / 7,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  selectedDate: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00D09E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '700',
  },
  createButton: {
    backgroundColor: '#00D09E',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
    shadowColor: '#00D09E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CreateGoalScreen;
