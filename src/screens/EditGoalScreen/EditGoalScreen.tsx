import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Dimensions, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../constants/config';
import { useFocusEffect } from '@react-navigation/native';

import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

const EditGoalScreen = ({ navigation, route }: any) => {
  const { goalId } = route.params || {};
  const { token } = useAuth();
  
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [priority, setPriority] = useState('Medium');
  const [includeTargetDate, setIncludeTargetDate] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = [
    { name: 'Tech', icon: 'laptop-outline' },
    { name: 'Home', icon: 'home-outline' },
    { name: 'Car', icon: 'car-outline' },
    { name: 'Travel', icon: 'airplane-outline' },
    { name: 'General', icon: 'wallet-outline' },
  ];

  const priorities = ['Low', 'Medium', 'High'];

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const fetchGoalData = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const g = response.data;
      setGoalName(g.goalName);
      setTargetAmount(g.targetAmount.toString());
      setSelectedCategory(g.category || 'General');
      setPriority(g.priority.charAt(0).toUpperCase() + g.priority.slice(1));
      
      if (g.targetDate) {
        setIncludeTargetDate(true);
        setDate(new Date(g.targetDate));
      } else {
        setIncludeTargetDate(false);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching goal data:', error);
      Alert.alert('Error', 'Failed to load goal details');
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (goalId) fetchGoalData();
  }, [goalId]);

  const handleUpdateGoal = async () => {
    if (!goalName || !targetAmount) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${API_URL}/goals/${goalId}`, {
        goalName,
        targetAmount: parseFloat(targetAmount),
        priority: priority.toLowerCase(),
        category: selectedCategory,
        targetDate: includeTargetDate ? date.toISOString() : null 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Goal updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating goal:', error);
      Alert.alert('Error', 'Failed to update goal');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGoal = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/goals/${goalId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              Alert.alert('Success', 'Goal deleted successfully');
               // Use proper route name
              navigation.navigate('SavingsGoals');
            } catch (error) {
              console.error('Error deleting goal:', error);
              Alert.alert('Error', 'Failed to delete goal');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00D09E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Goal</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => console.log('Notification pressed')} style={{ marginRight: 15 }}>
            <Icon name="notifications-outline" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUpdateGoal} disabled={saving}>
            {saving ? <ActivityIndicator size="small" color="#00D09E" /> : <Text style={styles.saveText}>Save</Text>}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>Goal Details</Text>

        {/* Goal Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Goal Name</Text>
          <View style={styles.textInputContainer}>
            <TextInput 
              style={styles.textInput}
              value={goalName}
              onChangeText={setGoalName}
              placeholder="e.g. My Dream House"
            />
          </View>
        </View>

        {/* Target Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Target Amount</Text>
          <View style={styles.textInputContainer}>
            <Text style={styles.currencyPrefix}>Rs. </Text>
            <TextInput 
              style={styles.textInput}
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="numeric"
              placeholder="0.00"
            />
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
            <View style={styles.skippedLabelContainer}>
              <Text style={styles.skippedLabelText}>No deadline set for this goal.</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={[styles.saveChangesButton, saving && { opacity: 0.7 }]} 
          onPress={handleUpdateGoal}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveChangesText}>Save Changes</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteGoal}>
          <Icon name="trash-outline" size={18} color="#FF5A5F" />
          <Text style={styles.deleteText}>Delete Goal</Text>
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
  saveText: {
    fontSize: 14,
    color: '#00D09E',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 12,
    color: '#9BA4B5',
    fontWeight: '600',
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
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 60,
  },
  currencyPrefix: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
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
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedCategoryIcon: {
    backgroundColor: '#00D09E',
  },
  categoryName: {
    fontSize: 10,
    color: '#9BA4B5',
    fontWeight: '600',
  },
  selectedCategoryName: {
    color: '#333',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  selectedPriorityButton: {
    backgroundColor: '#E2FCEE',
    borderColor: '#00D09E',
  },
  priorityText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  selectedPriorityText: {
    color: '#333',
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
  skippedLabelContainer: {
    height: 100,
    backgroundColor: '#F5F7FA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderStyle: 'dashed',
  },
  skippedLabelText: {
    fontSize: 13,
    color: '#9BA4B5',
    fontWeight: '500',
  },
  saveChangesButton: {
    backgroundColor: '#00D09E',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  saveChangesText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteText: {
    color: '#FF5A5F',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default EditGoalScreen;
