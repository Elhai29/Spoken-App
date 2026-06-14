import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!username || !password) {
      setError('אנא מלא את כל השדות');
      return;
    }

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('הסיסמאות אינן תואמות');
        return;
      }
      await AsyncStorage.setItem('registeredUser', JSON.stringify({ username, password }));
      Alert.alert('הצלחה', 'נרשמת בהצלחה! כעת ניתן להתחבר');
      setIsRegistering(false);
    } else {
      const savedUser = await AsyncStorage.getItem('registeredUser');
      const userData = savedUser ? JSON.parse(savedUser) : null;
      
      if (userData && userData.username === username && userData.password === password) {
        onLogin(username);
      } else {
        setError('שם משתמש או סיסמה אינם נכונים');
      }
    }
  };
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{isRegistering ? 'הרשמה' : 'התחברות'}</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="שם משתמש" 
          placeholderTextColor="#999" // זה מה שנותן את הכיתוב האפור
          value={username} 
          onChangeText={setUsername} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="סיסמה" 
          placeholderTextColor="#999" // זה מה שנותן את הכיתוב האפור
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />
        
        {isRegistering && (
          <TextInput style={styles.input} placeholder="אשר סיסמה" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
        )}

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>{isRegistering ? 'הירשם' : 'התחבר'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.toggleText}>{isRegistering ? 'כבר יש חשבון? התחבר' : 'אין חשבון? הירשם'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  title: { fontSize: 32, fontWeight: '900', marginBottom: 40, color: '#1A1A1A' },
  input: { width: '100%', backgroundColor: '#FFF', padding: 18, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#CCC', fontSize: 16 },
  errorText: { color: '#D32F2F', marginBottom: 15, fontWeight: 'bold' },
  button: { width: '100%', backgroundColor: '#D32F2F', padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  toggleText: { marginTop: 20, color: '#555', fontWeight: '600' }
});