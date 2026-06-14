import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
// שים לב: אנחנו מייבאים את SafeAreaView מהספרייה החדשה כפי שתיקנו קודם
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ParticipantsScreen({ userName }) {
  
  const [performances, setPerformances] = useState([
    { id: '1', name: 'אלחי', style: 'רוק / מזרחי', ownerName: 'אלחי' },
    { id: '2', name: 'דנה', style: 'שירת רחוב', ownerName: 'דנה' },
    { id: '3', name: 'יוסי', style: 'ראפ', ownerName: 'יוסי' },
    { id: '4', name: 'מיכל', style: 'פופ אקוסטי', ownerName: 'מיכל' },
  ]);

  const handleViewInspiration = (itemName) => {
    Alert.alert('צפייה בפרופיל', `מעבר לדף המלא של ${itemName} כדי לראות סרטונים ופרטים.`);
  };

  const handleEdit = (itemName) => {
    Alert.alert('מצב עריכה', `נפתח חלון עריכת פרופיל מאובטח עבור: ${itemName}`);
  };

  const renderPerformance = ({ item }) => {
    const isOwner = userName === item.ownerName;

    return (
      <TouchableOpacity 
        style={styles.performanceCard} 
        onPress={() => handleViewInspiration(item.name)}
      >
        <View style={styles.avatarCircle}>
           <MaterialCommunityIcons name="account-music" size={28} color="#FFF" />
        </View>
        
        <View style={styles.performanceInfo}>
          <Text style={styles.performanceName}>{item.name}</Text>
          <Text style={styles.performanceStyle}>{item.style}</Text>
        </View>
        
        {isOwner ? (
          <TouchableOpacity 
            style={styles.editPencilButton}
            onPress={() => handleEdit(item.name)}
          >
            <MaterialCommunityIcons name="pencil" size={22} color="#D32F2F" />
          </TouchableOpacity>
        ) : (
          <MaterialCommunityIcons name="chevron-left" size={24} color="#A0A0A0" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>כל המשתתפים 🎤</Text>
      
      <FlatList
        data={performances}
        renderItem={renderPerformance}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// הנה ה-styles שהיה חסר! הוא מחזיר את כל העיצוב למסך
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#F4F4F4', 
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'right', 
    margin: 20,
    marginTop: 30,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  performanceCard: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15, 
  },
  performanceInfo: {
    flex: 1,
    alignItems: 'flex-end', 
    marginRight: 10,
  },
  performanceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'right',
  },
  performanceStyle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  editPencilButton: {
    padding: 5,
  }
});