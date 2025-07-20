// web/src/App.js - Web version of Jap Mala App
import React, { useState, useEffect } from 'react';
import './App.css';

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
];

const MANTRAS = [
  {
    id: 'gayatri',
    name: 'गायत्री मंत्र',
    text: 'ॐ भूर् भुवः स्वः\nतत् सवितुर् वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात्',
    meaning: 'We meditate on the glory of the Creator',
    count: 108,
  },
  {
    id: 'mahamrityunjay',
    name: 'महामृत्युंजय मंत्र',
    text: 'ॐ त्र्यम्बकं यजामहे\nसुगन्धिं पुष्टिवर्धनम्\nउर्वारुकमिव बन्धनान्\nमृत्योर्मुक्षीय मामृतात्',
    meaning: 'We worship the three-eyed Lord Shiva',
    count: 108,
  },
];

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [currentDeity, setCurrentDeity] = useState(DEITIES[0]);
  const [count, setCount] = useState(0);
  const [malaCount, setMalaCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalMala, setTotalMala] = useState(0);
  const [history, setHistory] = useState([]);
  const [showDeityModal, setShowDeityModal] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streak, setStreak] = useState(0);
  
  // Meditation timer states
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(10);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('japMalaData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setTotalCount(data.totalCount || 0);
      setTotalMala(data.totalMala || 0);
      setHistory(data.history || []);
      setStreak(data.streak || 0);
      if (data.currentDeity) {
        const deity = DEITIES.find(d => d.id === data.currentDeity);
        if (deity) setCurrentDeity(deity);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const dataToSave = {
      currentDeity: currentDeity.id,
      totalCount,
      totalMala,
      history,
      streak,
      lastActiveDate: new Date().toDateString(),
    };
    localStorage.setItem('japMalaData', JSON.stringify(dataToSave));
  }, [currentDeity, totalCount, totalMala, history, streak]);

  // Meditation timer effect
  useEffect(() => {
    let interval = null;
    
    if (isTimerActive && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            setIsTimerActive(false);
            completeMeditation();
          } else {
            setTimerMinutes(timerMinutes - 1);
            setTimerSeconds(59);
          }
        } else {
          setTimerSeconds(timerSeconds - 1);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, timerMinutes, timerSeconds]);

  const handleChant = () => {
    const newCount = count + 1;
    setCount(newCount);
    setTotalCount(totalCount + 1);

    // Vibration for web (if supported)
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Play sound
    if (soundEnabled && newCount % 10 === 0) {
      playBellSound();
    }

    if (newCount >= 108) {
      completeMala();
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
    };
    setHistory([newEntry, ...history]);
    
    playBellSound();
    showNotification('माला पूर्ण!', `आपने ${currentDeity.name} नाम की ${newMalaCount} माला पूर्ण की।`);
  };

  const playBellSound = () => {
    const audio = new Audio('/sounds/bell.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const showNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon-192.png' });
    }
  };

  const startMeditation = () => {
    setTimerMinutes(selectedDuration);
    setTimerSeconds(0);
    setIsTimerActive(true);
  };

  const completeMeditation = () => {
    playBellSound();
    showNotification('ध्यान पूर्ण', `बधाई हो! आपने ${selectedDuration} मिनट का ध्यान पूर्ण किया।`);
  };

  const share = async () => {
    const shareData = {
      title: 'जप माला',
      text: `🙏 मैंने आज ${currentDeity.name} नाम की ${malaCount} माला पूर्ण की! कुल जप: ${totalCount} 🕉️`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(shareData.text);
        alert('Copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const renderHome = () => (
    <div className="home-container">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">दिन की streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">कुल जप</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalMala}</div>
          <div className="stat-label">कुल माला</div>
        </div>
      </div>

      <div className="deity-selector" onClick={() => setShowDeityModal(true)}>
        <h2 className="deity-name">{currentDeity.name}</h2>
        <p className="deity-mantra">{currentDeity.mantra}</p>
      </div>

      <div 
        className="chant-button"
        style={{ background: `linear-gradient(135deg, ${currentDeity.color}, ${COLORS.primary})` }}
        onClick={handleChant}
      >
        <div className="chant-count">{count}</div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(count / 108) * 100}%` }}
          />
        </div>
      </div>

      <div className="session-info">
        <h3>वर्तमान सत्र</h3>
        <div className="session-stats">
          <div>
            <span className="session-value">{malaCount}</span>
            <span className="session-label">माला</span>
          </div>
          <div>
            <span className="session-value">{malaCount * 108 + count}</span>
            <span className="session-label">जप</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-btn" onClick={() => setCount(0)}>रीसेट</button>
        <button className="action-btn" onClick={share}>साझा करें</button>
      </div>

      {/* Deity Modal */}
      {showDeityModal && (
        <div className="modal-overlay" onClick={() => setShowDeityModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>देवता चुनें</h2>
            <div className="deity-list">
              {DEITIES.map(deity => (
                <div 
                  key={deity.id}
                  className={`deity-item ${currentDeity.id === deity.id ? 'selected' : ''}`}
                  style={{ borderColor: deity.color }}
                  onClick={() => {
                    setCurrentDeity(deity);
                    setShowDeityModal(false);
                  }}
                >
                  <h3 style={{ color: deity.color }}>{deity.name}</h3>
                  <p>{deity.mantra}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMantras = () => (
    <div className="mantras-container">
      <h1 className="page-title">पवित्र मंत्र</h1>
      <div className="mantras-grid">
        {MANTRAS.map(mantra => (
          <div key={mantra.id} className="mantra-card">
            <h2>{mantra.name}</h2>
            <p className="mantra-text">{mantra.text}</p>
            <p className="mantra-meaning">{mantra.meaning}</p>
            <button className="mantra-btn">जप शुरू करें ({mantra.count} बार)</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMeditation = () => (
    <div className="meditation-container">
      <h1 className="page-title">ध्यान टाइमर</h1>
      
      {!isTimerActive ? (
        <>
          <p className="meditation-prompt">ध्यान की अवधि चुनें:</p>
          <div className="duration-grid">
            {[5, 10, 15, 20, 30, 45, 60].map(duration => (
              <button
                key={duration}
                className={`duration-btn ${selectedDuration === duration ? 'selected' : ''}`}
                onClick={() => setSelectedDuration(duration)}
              >
                {duration} मिनट
              </button>
            ))}
          </div>
          <button className="start-meditation-btn" onClick={startMeditation}>
            ध्यान शुरू करें
          </button>
        </>
      ) : (
        <>
          <div className="timer-display">
            {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
          </div>
          <p className="breathing-guide">श्वास लें... श्वास छोड़ें...</p>
          <button className="stop-meditation-btn" onClick={() => setIsTimerActive(false)}>
            रोकें
          </button>
        </>
      )}
      
      <div className="meditation-tips">
        <h3>ध्यान सुझाव:</h3>
        <ul>
          <li>आरामदायक स्थिति में बैठें</li>
          <li>आँखें बंद करें या धीमे से खुली रखें</li>
          <li>सांस पर ध्यान केंद्रित करें</li>
          <li>विचार आने दें और जाने दें</li>
        </ul>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-container">
      <h1 className="page-title">सेटिंग्स</h1>
      
      <div className="settings-section">
        <h2>ध्वनि और कंपन</h2>
        <div className="setting-row">
          <span>कंपन</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={vibrationEnabled}
              onChange={(e) => setVibrationEnabled(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-row">
          <span>ध्वनि</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      <div className="about-section">
        <h2>ऐप के बारे में</h2>
        <p>जप माला v1.0.0</p>
        <p>डिजिटल माला काउंटर</p>
        <p>🕉️ सर्वे भवन्तु सुखिनः 🕉️</p>
      </div>
    </div>
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>📿 जप माला</h1>
      </header>

      <main className="app-main">
        {currentTab === 'home' && renderHome()}
        {currentTab === 'mantras' && renderMantras()}
        {currentTab === 'meditation' && renderMeditation()}
        {currentTab === 'settings' && renderSettings()}
      </main>

      <nav className="app-nav">
        <button 
          className={`nav-btn ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentTab('home')}
        >
          <span className="nav-icon">📿</span>
          <span className="nav-label">जप</span>
        </button>
        <button 
          className={`nav-btn ${currentTab === 'mantras' ? 'active' : ''}`}
          onClick={() => setCurrentTab('mantras')}
        >
          <span className="nav-icon">🕉️</span>
          <span className="nav-label">मंत्र</span>
        </button>
        <button 
          className={`nav-btn ${currentTab === 'meditation' ? 'active' : ''}`}
          onClick={() => setCurrentTab('meditation')}
        >
          <span className="nav-icon">🧘</span>
          <span className="nav-label">ध्यान</span>
        </button>
        <button 
          className={`nav-btn ${currentTab === 'settings' ? 'active' : ''}`}
          onClick={() => setCurrentTab('settings')}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">सेटिंग्स</span>
        </button>
      </nav>
    </div>
  );
}

export default App;