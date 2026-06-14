import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';

export default function UsersScreen() {
  // נתוני דמה של המשתתפים והארכיון שלהם
  const usersData = [
    {
      id: '1',
      name: 'אלחי',
      style: 'שירה מדוברת וקטעי מעבר',
      videos: [
        { id: 'v1', title: 'מילים ברוח (מופע יוני 2025)', url: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }
      ]
    },
    {
      id: '2',
      name: 'דנה',
      style: 'ספוקן וורד נוקב',
      videos: [
        { id: 'v2', title: 'שירת רחוב (מופע אפריל 2025)', url: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
        { id: 'v3', title: 'זמן שאבד', url: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }
      ]
    },
    {
      id: '3',
      name: 'יותם',
      style: 'שירה קומית',
      videos: [] // למשתתף הזה אין עדיין סרטונים
    }
  ];

  // משתנה ששומר על מי לחצנו כדי לפתוח את הארכיון שלו
  const [selectedUser, setSelectedUser] = useState(null);

  // עיצוב כרטיסייה של משתתף ברשימה
 const renderUserCard = ({ item }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => setSelectedUser(item)}>
      
      {/* 1. האייקון מצד ימין */}
      <View style={styles.avatarCircle}>
        <MaterialCommunityIcons name="account-mic" size={30} color="#FFFFFF" />
      </View>

      {/* 2. הטקסטים מוזזים לימין בתוך התיבה שלהם */}
      <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 15 }}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userStyle}>{item.style}</Text>
      </View>

      {/* 3. החץ בצד שמאל */}
      <MaterialCommunityIcons name="chevron-left" size={24} color="#D32F2F" />
      
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>האמנים שלנו</Text>

      {/* רשימת המשתתפים */}
      <FlatList
        data={usersData}
        keyExtractor={item => item.id}
        renderItem={renderUserCard}
        contentContainerStyle={styles.listContainer}
      />

      {/* חלון קופץ (Modal) שמציג את הארכיון של המשתתף שנבחר */}
      <Modal visible={selectedUser !== null} animationType="slide" transparent={false}>
        {selectedUser && (
          <SafeAreaView style={styles.modalContainer}>
            
            {/* כותרת החלון וכפתור סגירה */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={30} color="#1A1A1A" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>הארכיון של {selectedUser.name}</Text>
            </View>

            {/* הצגת הסרטונים או הודעה שאין סרטונים */}
            {selectedUser.videos.length > 0 ? (
              <FlatList
                data={selectedUser.videos}
                keyExtractor={v => v.id}
                contentContainerStyle={styles.videosList}
                renderItem={({ item }) => (
                  <View style={styles.videoCard}>
                    <Text style={styles.videoTitle}>🎬 {item.title}</Text>
                    <Video
                      source={{ uri: item.url }}
                      style={styles.videoPlayer}
                      useNativeControls
                      resizeMode="cover"
                      isLooping={false}
                    />
                  </View>
                )}
              />
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="movie-open-remove" size={70} color="#CCCCCC" />
                <Text style={styles.emptyText}>אין עדיין סרטונים בארכיון הזה.</Text>
              </View>
            )}

          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  userCard: {
    flexDirection: 'row', // נשמור על כיוון רגיל (אייקון מימין, טקסט משמאל)
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    // ... שאר העיצוב
  },
  userInfo: {
    flex: 1,
    alignItems: 'flex-end', // זה מה שמושך את הטקסט לצד ימין בתוך התיבה שלו
    paddingRight: 15,       // מרווח מהאייקון
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'left',
  },
  userStyle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'left',
  },
  // עיצוב החלון הקופץ (Modal)
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginRight: 35, // מאזן את כפתור הסגירה כדי שהכותרת תהיה באמצע
  },
  videosList: {
    padding: 20,
  },
  videoCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    textAlign: 'left',
  },
  videoPlayer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 18,
    color: '#999999',
  }
});