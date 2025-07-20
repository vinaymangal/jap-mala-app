// App.js - Enhanced Jap Mala App with All Features
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  Vibration,
  StatusBar,
  Dimensions,
  Image,
  Switch,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';

const { width, height } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// Constants
const COLORS = {
  primary: '#FF6B35',
  secondary: '#FFE5DB',
  accent: '#FFB3B3',
  background: '#FFF5F5',
  white: '#FFFFFF',
  text: '#333333',
  lightText: '#666666',
  success: '#4CAF50',
  error: '#F44336',
  gold: '#FFD700',
  krishnaBlue: '#1976D2',
  shivaAsh: '#757575',
  lotus: '#E91E63',
};

const DEITIES = [
  { id: 'ram', name: 'राम', mantra: 'जय श्री राम', color: COLORS.primary },
  { id: 'krishna', name: 'कृष्ण', mantra: 'हरे कृष्ण', color: COLORS.krishnaBlue },
  { id: 'radha', name: 'राधा', mantra: 'राधे राधे', color: COLORS.lotus },
  { id: 'shiva', name: 'शिव', mantra: 'ॐ नमः शिवाय', color: COLORS.shivaAsh },
  { id: 'hanuman', name: 'हनुमान', mantra: 'जय हनुमान', color: COLORS.primary },
  { id: 'ganesh', name: 'गणेश', mantra: 'ॐ गं गणपतये नमः', color: COLORS.gold },
  { id: 'durga', name: 'दुर्गा', mantra: 'जय माता दी', color: COLORS.error },
  { id: 'lakshmi', name: 'लक्ष्मी', mantra: 'ॐ श्रीं महालक्ष्म्यै नमः', color: COLORS.gold },
  { id: 'saraswati', name: 'सरस्वती', mantra: 'ॐ ऐं सरस्वत्यै नमः', color: COLORS.white },
  { id: 'vishnu', name: 'विष्णु', mantra: 'ॐ नमो नारायणाय', color: COLORS.krishnaBlue },
];

const MANTRAS = [
  {
    id: 'gayatri',
    name: 'गायत्री मंत्र',
    text: 'ॐ भूर् भुवः स्वः\nतत् सवितुर् वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात्',
    meaning: 'We meditate on the glory of the Creator who has created the Universe',
    benefits: 'Enhances wisdom and spiritual growth',
    count: 108,
  },
  {
    id: 'mahamrityunjay',
    name: 'महामृत्युंजय मंत्र',
    text: 'ॐ त्र्यम्बकं यजामहे\nसुगन्धिं पुष्टिवर्धनम्\nउर्वारुकमिव बन्धनान्\nमृत्योर्मुक्षीय मामृतात्',
    meaning: 'We worship the three-eyed Lord Shiva who nourishes all beings',
    benefits: 'Protection from untimely death and diseases',
    count: 108,
  },
];

// Sound initialization
Sound.setCategory('Playback');
let bellSound = new Sound('bell.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) console.log('Failed to load bell sound', error);
});

// Home Screen Component
const HomeScreen = () => {
  const [currentDeity, setCurrentDeity] = useState(DEITIES[0]);
  const [count, setCount] = useState(0);
  const [malaCount, setMalaCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalMala, setTotalMala] = useState(0);
  const [history, setHistory] = useState([]);
  const [showDeityModal, setShowDeityModal] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dailyTarget, setDailyTarget] = useState(108);
  const [todayCount, setTodayCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sankalp, setSankalp] = useState(null);

  useEffect(() => {
    loadData();
    checkDailyReset();
  }, []);

  useEffect(() => {
    saveData();
  }, [count, malaCount, totalCount, totalMala, currentDeity, history, todayCount, streak]);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.multiGet([
        'currentDeity',
        'totalCount',
        'totalMala',
        'history',
        'todayCount',
        'streak',
        'lastActiveDate',
        'sankalp',
      ]);
      
      const dataMap = Object.fromEntries(savedData);
      
      if (dataMap.currentDeity) {
        const deity = DEITIES.find(d => d.id === dataMap.currentDeity) || DEITIES[0];
        setCurrentDeity(deity);
      }
      if (dataMap.totalCount) setTotalCount(parseInt(dataMap.totalCount));
      if (dataMap.totalMala) setTotalMala(parseInt(dataMap.totalMala));
      if (dataMap.history) setHistory(JSON.parse(dataMap.history));
      if (dataMap.todayCount) setTodayCount(parseInt(dataMap.todayCount));
      if (dataMap.streak) setStreak(parseInt(dataMap.streak));
      if (dataMap.sankalp) setSankalp(JSON.parse(dataMap.sankalp));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.multiSet([
        ['currentDeity', currentDeity.id],
        ['totalCount', totalCount.toString()],
        ['totalMala', totalMala.toString()],
        ['history', JSON.stringify(history)],
        ['todayCount', todayCount.toString()],
        ['streak', streak.toString()],
        ['lastActiveDate', new Date().toDateString()],
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const checkDailyReset = async () => {
    try {
      const lastActiveDate = await AsyncStorage.getItem('lastActiveDate');
      const today = new Date().toDateString();
      
      if (lastActiveDate !== today) {
        // New day - reset daily count and update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActiveDate === yesterday.toDateString() && todayCount >= dailyTarget) {
          setStreak(streak + 1);
        } else if (lastActiveDate !== yesterday.toDateString()) {
          setStreak(0);
        }
        
        setTodayCount(0);
        await AsyncStorage.setItem('lastActiveDate', today);
      }
    } catch (error) {
      console.error('Error checking daily reset:', error);
    }
  };

  const handleChant = () => {
    const newCount = count + 1;
    setCount(newCount);
    setTotalCount(totalCount + 1);
    setTodayCount(todayCount + 1);

    if (vibrationEnabled) {
      Vibration.vibrate(50);
    }

    if (soundEnabled && newCount % 10 === 0) {
      bellSound.play();
    }

    if (newCount >= 108) {
      completeMala();
    }

    // Check daily target achievement
    if (todayCount + 1 === dailyTarget) {
      Alert.alert(
        '🎉 दैनिक लक्ष्य पूर्ण!',
        `बधाई हो! आपने आज का ${dailyTarget} जप का लक्ष्य पूरा किया।`,
        [{ text: 'जय हो!', onPress: () => {} }]
      );
    }
  };

  const completeMala = () => {
    setCount(0);
    const newMalaCount = malaCount + 1;
    setMalaCount(newMalaCount);
    setTotalMala(totalMala + 1);
    
    const newEntry = {
      id: Date.now().toString(),
      deity: currentDeity.name,
      malaCount: newMalaCount,
      date: new Date().toLocaleDateString('hi-IN'),
      time: new Date().toLocaleTimeString('hi-IN'),
      day: new Date().toLocaleDateString('hi-IN', { weekday: 'long' }),
    };
    setHistory([newEntry, ...history]);
    
    if (soundEnabled) {
      bellSound.play();
    }
    
    Alert.alert(
      '🎉 माला पूर्ण!',
      `आपने ${currentDeity.name} नाम की ${newMalaCount} माला पूर्ण की।`,
      [
        { text: 'साझा करें', onPress: shareMalaCompletion },
        { text: 'जय हो!', onPress: () => {} }
      ]
    );
  };

  const shareMalaCompletion = () => {
    Share.open({
      message: `🙏 मैंने आज ${currentDeity.name} नाम की ${malaCount} माला पूर्ण की! कुल जप: ${totalCount} 🕉️\n\n#JapMala #${currentDeity.name}`,
    }).catch(err => console.log(err));
  };

  const createSankalp = () => {
    Alert.prompt(
      'संकल्प लें',
      'कितने दिनों में कितनी माला पूर्ण करनी है?',
      [
        { text: 'रद्द करें', style: 'cancel' },
        {
          text: 'संकल्प लें',
          onPress: (text) => {
            const newSankalp = {
              target: parseInt(text) || 1008,
              startDate: new Date().toISOString(),
              completed: 0,
              deity: currentDeity.id,
            };
            setSankalp(newSankalp);
            AsyncStorage.setItem('sankalp', JSON.stringify(newSankalp));
          }
        }
      ],
      'plain-text',
      '1008'
    );
  };

  const renderProgressRing = () => {
    const progress = (count / 108) * 100;
    const circumference = 2 * Math.PI * 90;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={styles.progressRingContainer}>
        <Svg width={200} height={200}>
          <Circle
            cx="100"
            cy="100"
            r="90"
            stroke={COLORS.secondary}
            strokeWidth="10"
            fill="none"
          />
          <Circle
            cx="100"
            cy="100"
            r="90"
            stroke={currentDeity.color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        </Svg>
        <View style={styles.progressRingCenter}>
          <Text style={[styles.countText, { color: currentDeity.color }]}>{count}</Text>
          <Text style={styles.countLabel}>/ 108</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[currentDeity.color, COLORS.background]}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Stats */}
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>दिन की streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{todayCount}</Text>
              <Text style={styles.statLabel}>आज के जप</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalMala}</Text>
              <Text style={styles.statLabel}>कुल माला</Text>
            </View>
          </View>

          {/* Deity Section */}
          <TouchableOpacity
            style={styles.deitySelector}
            onPress={() => setShowDeityModal(true)}
          >
            <Text style={styles.deityName}>{currentDeity.name}</Text>
            <Text style={styles.deityMantra}>{currentDeity.mantra}</Text>
          </TouchableOpacity>

          {/* Progress Ring */}
          <TouchableOpacity
            style={styles.chantButton}
            onPress={handleChant}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[currentDeity.color, COLORS.primary]}
              style={styles.chantButtonGradient}
            >
              <Text style={styles.chantButtonText}>{count}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(count / 108) * 100}%`, backgroundColor: COLORS.white }
                  ]} 
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sankalp Card */}
          {sankalp ? (
            <View style={styles.sankalpCard}>
              <Text style={styles.sankalpTitle}>संकल्प प्रगति</Text>
              <Text style={styles.sankalpText}>
                {sankalp.completed} / {sankalp.target} माला
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${(sankalp.completed / sankalp.target) * 100}%`,
                      backgroundColor: COLORS.success 
                    }
                  ]} 
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.sankalpButton} onPress={createSankalp}>
              <Text style={styles.sankalpButtonText}>संकल्प लें 🙏</Text>
            </TouchableOpacity>
          )}

          {/* Current Session */}
          <View style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>वर्तमान सत्र</Text>
            <View style={styles.sessionStats}>
              <View style={styles.sessionStat}>
                <Text style={styles.sessionStatValue}>{malaCount}</Text>
                <Text style={styles.sessionStatLabel}>माला</Text>
              </View>
              <View style={styles.sessionStat}>
                <Text style={styles.sessionStatValue}>{malaCount * 108 + count}</Text>
                <Text style={styles.sessionStatLabel}>कुल जप</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setCount(0)}>
              <Text style={styles.actionButtonText}>रीसेट</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={shareMalaCompletion}>
              <Text style={styles.actionButtonText}>साझा करें</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Deity Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeityModal}
        onRequestClose={() => setShowDeityModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>देवता चुनें</Text>
            <FlatList
              data={DEITIES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.deityItem,
                    { backgroundColor: item.color + '20' },
                    currentDeity.id === item.id && styles.selectedDeity
                  ]}
                  onPress={() => {
                    setCurrentDeity(item);
                    setShowDeityModal(false);
                  }}
                >
                  <Text style={[styles.deityItemName, { color: item.color }]}>
                    {item.name}
                  </Text>
                  <Text style={styles.deityItemMantra}>{item.mantra}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDeityModal(false)}
            >
              <Text style={styles.closeButtonText}>बंद करें</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Mantras Screen Component
const MantrasScreen = () => {
  const [selectedMantra, setSelectedMantra] = useState(null);
  const [chantCount, setChantCount] = useState(0);
  const [isChanting, setIsChanting] = useState(false);

  const startChanting = (mantra) => {
    setSelectedMantra(mantra);
    setChantCount(0);
    setIsChanting(true);
  };

  const handleMantraChant = () => {
    setChantCount(chantCount + 1);
    Vibration.vibrate(30);
    
    if (chantCount + 1 >= selectedMantra.count) {
      Alert.alert(
        'मंत्र जप पूर्ण!',
        `आपने ${selectedMantra.name} का ${selectedMantra.count} बार जप पूर्ण किया।`,
        [{ text: 'ॐ', onPress: () => setIsChanting(false) }]
      );
    }
  };

  if (isChanting && selectedMantra) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.gradient}>
          <View style={styles.mantraChantingContainer}>
            <Text style={styles.mantraTitle}>{selectedMantra.name}</Text>
            <Text style={styles.mantraText}>{selectedMantra.text}</Text>
            
            <TouchableOpacity
              style={styles.mantraChantButton}
              onPress={handleMantraChant}
            >
              <Text style={styles.mantraChantCount}>{chantCount}</Text>
              <Text style={styles.mantraChantLabel}>/ {selectedMantra.count}</Text>
            </TouchableOpacity>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(chantCount / selectedMantra.count) * 100}%` }
                ]} 
              />
            </View>
            
            <TouchableOpacity
              style={styles.stopButton}
              onPress={() => setIsChanting(false)}
            >
              <Text style={styles.stopButtonText}>समाप्त करें</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.mantrasContainer}>
        <Text style={styles.screenTitle}>पवित्र मंत्र</Text>
        
        {MANTRAS.map((mantra) => (
          <TouchableOpacity
            key={mantra.id}
            style={styles.mantraCard}
            onPress={() => startChanting(mantra)}
          >
            <Text style={styles.mantraCardTitle}>{mantra.name}</Text>
            <Text style={styles.mantraCardText}>{mantra.text}</Text>
            <Text style={styles.mantraCardMeaning}>अर्थ: {mantra.meaning}</Text>
            <Text style={styles.mantraCardBenefits}>लाभ: {mantra.benefits}</Text>
            <View style={styles.mantraCardButton}>
              <Text style={styles.mantraCardButtonText}>जप शुरू करें ({mantra.count} बार)</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// Meditation Timer Screen
const MeditationScreen = () => {
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(10);

  useEffect(() => {
    let interval = null;
    
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            completeMeditation();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const startMeditation = () => {
    setMinutes(selectedDuration);
    setSeconds(0);
    setIsActive(true);
  };

  const stopMeditation = () => {
    setIsActive(false);
    setMinutes(selectedDuration);
    setSeconds(0);
  };

  const completeMeditation = () => {
    Vibration.vibrate([500, 500, 500]);
    if (bellSound) bellSound.play();
    Alert.alert(
      '🧘 ध्यान पूर्ण',
      `बधाई हो! आपने ${selectedDuration} मिनट का ध्यान पूर्ण किया।`,
      [{ text: 'ॐ शांति', onPress: () => {} }]
    );
  };

  const durations = [5, 10, 15, 20, 30, 45, 60];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[COLORS.krishnaBlue, COLORS.background]} style={styles.gradient}>
        <View style={styles.meditationContainer}>
          <Text style={styles.screenTitle}>ध्यान टाइमर</Text>
          
          {!isActive ? (
            <>
              <Text style={styles.meditationPrompt}>ध्यान की अवधि चुनें:</Text>
              <View style={styles.durationGrid}>
                {durations.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationButton,
                      selectedDuration === duration && styles.selectedDuration
                    ]}
                    onPress={() => setSelectedDuration(duration)}
                  >
                    <Text style={[
                      styles.durationText,
                      selectedDuration === duration && styles.selectedDurationText
                    ]}>
                      {duration} मिनट
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity style={styles.startMeditationButton} onPress={startMeditation}>
                <Text style={styles.startMeditationText}>ध्यान शुरू करें</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.timerDisplay}>
                <Text style={styles.timerText}>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </Text>
              </View>
              
              <View style={styles.breathingGuide}>
                <Text style={styles.breathingText}>श्वास लें... श्वास छोड़ें...</Text>
              </View>
              
              <TouchableOpacity style={styles.stopMeditationButton} onPress={stopMeditation}>
                <Text style={styles.stopMeditationText}>रोकें</Text>
              </TouchableOpacity>
            </>
          )}
          
          <View style={styles.meditationTips}>
            <Text style={styles.tipsTitle}>ध्यान सुझाव:</Text>
            <Text style={styles.tipText}>• आरामदायक स्थिति में बैठें</Text>
            <Text style={styles.tipText}>• आँखें बंद करें या धीमे से खुली रखें</Text>
            <Text style={styles.tipText}>• सांस पर ध्यान केंद्रित करें</Text>
            <Text style={styles.tipText}>• विचार आने दें और जाने दें</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Settings Screen
const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    vibration: true,
    sound: true,
    dailyReminder: false,
    reminderTime: '06:00',
    theme: 'default',
    language: 'hindi',
  });

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.settingsContainer}>
        <Text style={styles.screenTitle}>सेटिंग्स</Text>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>ध्वनि और कंपन</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>कंपन</Text>
            <Switch
              value={settings.vibration}
              onValueChange={(value) => updateSetting('vibration', value)}
              trackColor={{ false: COLORS.lightText, true: COLORS.primary }}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>ध्वनि</Text>
            <Switch
              value={settings.sound}
              onValueChange={(value) => updateSetting('sound', value)}
              trackColor={{ false: COLORS.lightText, true: COLORS.primary }}
            />
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>अनुस्मारक</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>दैनिक अनुस्मारक</Text>
            <Switch
              value={settings.dailyReminder}
              onValueChange={(value) => updateSetting('dailyReminder', value)}
              trackColor={{ false: COLORS.lightText, true: COLORS.primary }}
            />
          </View>
        </View>
        
        <TouchableOpacity style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>ऐप के बारे में</Text>
          <Text style={styles.aboutText}>जप माला v1.0.0</Text>
          <Text style={styles.aboutText}>डिजिटल माला काउंटर</Text>
          <Text style={styles.aboutText}>🕉️ सर्वे भवन्तु सुखिनः 🕉️</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Main App Component with Navigation
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.lightText,
          tabBarStyle: styles.tabBar,
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarLabel: 'जप',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>📿</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Mantras" 
          component={MantrasScreen}
          options={{
            tabBarLabel: 'मंत्र',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>🕉️</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Meditation" 
          component={MeditationScreen}
          options={{
            tabBarLabel: 'ध्यान',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>🧘</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            tabBarLabel: 'सेटिंग्स',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>⚙️</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 5,
  },
  deitySelector: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    elevation: 5,
  },
  deityName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  deityMantra: {
    fontSize: 20,
    color: COLORS.lightText,
    marginTop: 5,
  },
  chantButton: {
    alignSelf: 'center',
    marginVertical: 30,
  },
  chantButtonGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  chantButtonText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  progressBar: {
    width: 160,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
  sankalpCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    marginBottom: 20,
  },
  sankalpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  sankalpText: {
    fontSize: 16,
    color: COLORS.lightText,
    marginBottom: 10,
  },
  sankalpButton: {
    backgroundColor: COLORS.gold,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  sankalpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  sessionCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    marginBottom: 20,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sessionStat: {
    alignItems: 'center',
  },
  sessionStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sessionStatLabel: {
    fontSize: 14,
    color: COLORS.lightText,
    marginTop: 5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  deityItem: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  selectedDeity: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  deityItemName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  deityItemMantra: {
    fontSize: 14,
    color: COLORS.lightText,
    marginTop: 5,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 20,
  },
  mantrasContainer: {
    flex: 1,
    padding: 20,
  },
  mantraCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },
  mantraCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  mantraCardText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 10,
  },
  mantraCardMeaning: {
    fontSize: 14,
    color: COLORS.lightText,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  mantraCardBenefits: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 15,
  },
  mantraCardButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  mantraCardButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  mantraChantingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mantraTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 20,
  },
  mantraText: {
    fontSize: 20,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 40,
  },
  mantraChantButton: {
    backgroundColor: COLORS.white,
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    marginBottom: 30,
  },
  mantraChantCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  mantraChantLabel: {
    fontSize: 18,
    color: COLORS.lightText,
  },
  stopButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  stopButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  meditationContainer: {
    flex: 1,
    padding: 20,
  },
  meditationPrompt: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  durationButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
    elevation: 2,
  },
  selectedDuration: {
    backgroundColor: COLORS.primary,
  },
  durationText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedDurationText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  startMeditationButton: {
    backgroundColor: COLORS.krishnaBlue,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
  },
  startMeditationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  timerDisplay: {
    backgroundColor: COLORS.white,
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 10,
    marginVertical: 40,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.krishnaBlue,
  },
  breathingGuide: {
    alignItems: 'center',
    marginBottom: 30,
  },
  breathingText: {
    fontSize: 20,
    color: COLORS.text,
    opacity: 0.7,
  },
  stopMeditationButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
  },
  stopMeditationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  meditationTips: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginTop: 30,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 5,
  },
  settingsContainer: {
    flex: 1,
    padding: 20,
  },
  settingsSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  aboutSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 5,
  },
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
});

export default App;