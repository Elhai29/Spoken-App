import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function HomeScreen({ userName }) {
  
  // בדיקת הרשאה - רק משתמש מורשה (אלחי) יקבל גישת מנהל
  const isAdmin = userName === 'אלחי';

  const [videos, setVideos] = useState([
    { id: '1', name: 'אלחי', style: 'מילים ברוח', ownerName: 'אלחי', uploadedToYoutube: false },
    { id: '2', name: 'דנה', style: 'שירת רחוב', ownerName: 'דנה', uploadedToYoutube: true },
  ]);

  const [performances, setPerformances] = useState([
    { id: '1', name: 'אלחי', style: 'רוק / מזרחי', ownerName: 'אלחי' },
    { id: '2', name: 'דנה', style: 'שירת רחוב', ownerName: 'דנה' },
  ]);

  const [timeLeft, setTimeLeft] = useState('');
  const [showDate, setShowDate] = useState('2026-06-18T20:30:00');
  
  // הפכנו את המיקום לסטייט דינמי כדי שיהיה ניתן לעריכה
  const [location, setLocation] = useState('מועדון הופעות, תל אביב');
  
  const [isUploadingToApp, setIsUploadingToApp] = useState(false); 
  const [uploadingToYoutubeId, setUploadingToYoutubeId] = useState(null);

  useEffect(() => {
    const targetDate = new Date(showDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('המופע התחיל! 🎉');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');

      setTimeLeft(`${days} ימים | ${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [showDate]);

  const getFormattedShowDate = () => {
    const d = new Date(showDate);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} בשעה ${hours}:${minutes}`;
  };

  const addVideoToApp = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('הרשאה נדחתה', 'יש לאשר גישה לגלריה כדי לבחור סרטונים.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos, 
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setIsUploadingToApp(true);
      
      setTimeout(() => {
        const newVideo = {
          id: Date.now().toString(),
          name: userName, 
          style: 'ביצוע חדש',
          ownerName: userName,
          uploadedToYoutube: false 
        };
        
        setVideos([newVideo, ...videos]);
        setIsUploadingToApp(false);
        Alert.alert('הצלחה!', 'הסרטון הועלה לאפליקציה בהצלחה ומופיע במסך הבית.');
      }, 2500); 
    }
  };

  const uploadToYoutube = (videoId) => {
    setUploadingToYoutubeId(videoId); 
    
    setTimeout(() => {
      setVideos(videos.map(v => v.id === videoId ? { ...v, uploadedToYoutube: true } : v));
      setUploadingToYoutubeId(null);
      Alert.alert('ההעלאה הושלמה!', 'הסרטון שודר בהצלחה לערוץ היוטיוב של SPOKEN! 🚀');
    }, 3000); 
  };

  const addToCalendar = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const writeableCalendars = calendars.filter(cal => cal.allowsModifications === true);
        const targetCalendar = writeableCalendars.find(cal => cal.isPrimary) || writeableCalendars[0];

        if (targetCalendar) {
          await Calendar.createEventAsync(targetCalendar.id, {
            title: 'מופע SPOKEN',
            startDate: new Date(showDate),
            endDate: new Date(new Date(showDate).getTime() + 2.5 * 60 * 60 * 1000),
            location: location, // משתמש במיקום הדינמי
            notes: 'אל תשכחו להביא כרטיסים!',
            timeZone: 'Asia/Jerusalem',
          });
          Alert.alert('יש!', 'המופע נוסף ליומן שלך בהצלחה 📅');
        }
      }
    } catch (error) {
      Alert.alert('תקלה', 'לא הצלחנו להוסיף את האירוע ליומן.');
    }
  };

  const handleViewInspiration = (itemName) => {
    Alert.alert('צפייה בביצוע', `כאן ייפתח דף ההשראה של ${itemName}.`);
  };

  const handleEdit = (itemType, itemName) => {
    Alert.alert('מצב עריכה', `נפתח חלון עריכה עבור ה- ${itemType} שלך: ${itemName}`);
  };

  // פונקציה חדשה לעריכת המיקום - זמינה רק למנהל
  const handleEditLocation = () => {
    if (!isAdmin) return;
    Alert.alert('עריכת מיקום', 'כאן ייפתח חלון מאובטח לעדכון מיקום המופע הבא.');
  };

  const renderVideo = ({ item }) => {
    const isOwner = userName === item.ownerName;
    const isThisUploadingYT = uploadingToYoutubeId === item.id;

    return (
      <View style={styles.videoCard}>
        <TouchableOpacity 
          style={styles.videoPlaceholder} 
          onPress={() => handleViewInspiration(item.name)}
        >
          {isOwner && (
            <TouchableOpacity 
              style={styles.editVideoButton} 
              onPress={() => handleEdit('סרטון', item.name)}
            >
              <MaterialCommunityIcons name="pencil" size={18} color="#FFF" />
            </TouchableOpacity>
          )}
          <MaterialCommunityIcons name="play-circle-outline" size={40} color="rgba(255,255,255,0.5)" style={styles.playIcon} />
        </TouchableOpacity>
        
        <View style={styles.videoTextContainer}>
          <Text style={styles.videoName}>{item.name}</Text>
          <Text style={styles.videoStyleText}>{item.style}</Text>
          
          {isOwner && !item.uploadedToYoutube && (
            <TouchableOpacity 
              style={styles.youtubeUploadButton} 
              onPress={() => uploadToYoutube(item.id)}
              disabled={isThisUploadingYT}
            >
              {isThisUploadingYT ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.youtubeButtonText}>העלה ל-YouTube</Text>
                  <MaterialCommunityIcons name="youtube" size={18} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          )}

          {isOwner && item.uploadedToYoutube && (
             <View style={styles.youtubeSuccessBadge}>
               <Text style={styles.youtubeSuccessText}>באוויר ב-YouTube</Text>
               <MaterialCommunityIcons name="check-circle" size={14} color="#2E7D32" />
             </View>
          )}
        </View>
      </View>
    );
  };

  const renderPerformance = ({ item }) => {
    const isOwner = userName === item.ownerName;
    return (
      <TouchableOpacity style={styles.performanceCard} onPress={() => handleViewInspiration(item.name)}>
        <View style={styles.avatarCircle}>
           <MaterialCommunityIcons name="account-music" size={28} color="#FFF" />
        </View>
        <View style={styles.performanceInfo}>
          <Text style={styles.performanceName}>{item.name}</Text>
          <Text style={styles.performanceStyle}>{item.style}</Text>
        </View>
        {isOwner ? (
          <TouchableOpacity style={styles.editPencilButton} onPress={() => handleEdit('פרופיל משתתף', item.name)}>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.welcomeText}>היי {userName || 'אורח'} 👋</Text>

        <View style={styles.logoContainer}>
          <Image 
            source={require('./assets/logo.jpeg')} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
          <Text style={styles.logoTitleText}>spoken IL</Text>
          <Text style={styles.logoSubtitleText}>כל ההופעות. כל הדיבור. במקום אחד.</Text>
        </View>

        <View style={styles.countdownCard}>
          {isAdmin && (
            <TouchableOpacity style={styles.editShowButton} onPress={() => Alert.alert('עריכת זמן', 'חלון עריכת זמן המופע')}>
              <MaterialCommunityIcons name="pencil" size={20} color="#666" />
            </TouchableOpacity>
          )}

          <Text style={styles.countdownTitle}>המופע הבא מתחיל בעוד: ⌛</Text>
          
          <View style={styles.timerBox}>
            <Text style={styles.timerText}>{timeLeft || 'מחשב זמן...'}</Text>
          </View>

          <View style={styles.divider} />
          
          {/* שורת המיקום החדשה - כוללת עיפרון עריכה רק אם המשתמש מנהל */}
          <View style={styles.locationContainerRow}>
            {isAdmin && (
              <TouchableOpacity style={styles.inlineEditButton} onPress={handleEditLocation}>
                <MaterialCommunityIcons name="pencil" size={16} color="#666" />
              </TouchableOpacity>
            )}
            <Text style={styles.locationText}>📍 {location}</Text>
          </View>

          <Text style={styles.dateText}>📅 {getFormattedShowDate()}</Text>
          
          <TouchableOpacity style={styles.calendarButton} onPress={addToCalendar}>
            <Text style={styles.calendarButtonText}>הוסף ליומן שלי 🗓️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ביצועים מהמופע האחרון 🎬</Text>
          <TouchableOpacity style={styles.addAppVideoButton} onPress={addVideoToApp} disabled={isUploadingToApp}>
            {isUploadingToApp ? (
              <ActivityIndicator size="small" color="#D32F2F" />
            ) : (
              <MaterialCommunityIcons name="plus-circle" size={32} color="#D32F2F" />
            )}
          </TouchableOpacity>
        </View>

        <FlatList
          data={videos}
          renderItem={renderVideo}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.videoScrollContainer}
          style={{ marginBottom: 20 }}
        />

        <Text style={styles.sectionTitle}>רשימת משתתפים 🎤</Text>
        {performances.map((item) => (
           <React.Fragment key={item.id}>
             {renderPerformance({ item })}
           </React.Fragment>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  scrollContent: { padding: 20, paddingBottom: 50 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', alignSelf: 'flex-end', marginBottom: 5 },
  logoContainer: { alignItems: 'center', marginBottom: 35, marginTop: 10 },
  logoImage: { width: width * 0.45, height: 130 }, 
  logoTitleText: { fontSize: 38, fontWeight: '900', color: '#1A1A1A', marginTop: 8, letterSpacing: 2 },
  logoSubtitleText: { fontSize: 18, color: '#444', fontWeight: 'bold', marginTop: 6, textAlign: 'center' }, 
  countdownCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, marginBottom: 40, borderTopWidth: 5, borderTopColor: '#D32F2F', elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, position: 'relative' },
  editShowButton: { position: 'absolute', top: 15, left: 15, zIndex: 10, padding: 5 },
  countdownTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', marginBottom: 15 },
  timerBox: { backgroundColor: '#1A1A1A', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 15 },
  timerText: { color: '#FFF', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
  divider: { height: 1, backgroundColor: '#EEEEEE', marginBottom: 15 },
  
  // סגנונות חדשים לשורת המיקום ועריכתה
  locationContainerRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  inlineEditButton: { 
    marginRight: 8, 
    padding: 3 
  },
  locationText: { fontSize: 16, color: '#555', textAlign: 'center' }, 
  
  dateText: { fontSize: 16, color: '#D32F2F', textAlign: 'center', fontWeight: 'bold', marginBottom: 20 },
  calendarButton: { backgroundColor: '#D32F2F', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  calendarButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#1A1A1A' },
  addAppVideoButton: { padding: 5 },
  videoScrollContainer: { flexDirection: 'row-reverse', paddingBottom: 10 },
  videoCard: { width: width * 0.45, backgroundColor: '#FFF', borderRadius: 15, marginLeft: 15, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  videoPlaceholder: { height: 120, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  playIcon: { position: 'absolute' },
  editVideoButton: { position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(211, 47, 47, 0.85)', padding: 8, borderBottomRightRadius: 10, zIndex: 10 },
  videoTextContainer: { padding: 10 },
  videoName: { fontSize: 18, fontWeight: '900', color: '#D32F2F', textAlign: 'right' },
  videoStyleText: { fontSize: 14, color: '#666', textAlign: 'right', marginTop: 2, marginBottom: 8 },
  youtubeUploadButton: { backgroundColor: '#FF0000', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', marginTop: 5 },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  youtubeButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginRight: 6 },
  youtubeSuccessBadge: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#E8F5E9', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 6, marginTop: 5, alignSelf: 'flex-end' },
  youtubeSuccessText: { color: '#2E7D32', fontSize: 12, fontWeight: 'bold', marginRight: 4 },
  performanceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2 },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  performanceInfo: { flex: 1, alignItems: 'flex-end', marginRight: 10 },
  performanceName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'right' },
  performanceStyle: { fontSize: 14, color: '#666', textAlign: 'right', marginTop: 4 },
  editPencilButton: { padding: 5 }
});