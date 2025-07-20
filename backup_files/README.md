# 📿 जप माला (Jap Mala) - Digital Mala Counter

<div align="center">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-blue.svg" alt="Platform" />
  <img src="https://img.shields.io/badge/Language-React%20Native-61DAFB.svg" alt="React Native" />
  <img src="https://img.shields.io/badge/Status-Active-success.svg" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
</div>

<div align="center">
  <h3>🕉️ Transform your spiritual practice with technology 🕉️</h3>
  <p>A beautiful, feature-rich digital mala counter for Hindu deity name chanting</p>
</div>

## ✨ Features

### 🙏 Core Features
- **Multi-Deity Support**: Choose from Ram, Krishna, Radha, Shiva, Hanuman, Ganesh, and more
- **Smart Counter**: Automatic mala completion at 108 counts
- **Progress Tracking**: Daily, weekly, and lifetime statistics
- **Offline First**: Works without internet, all data saved locally
- **Beautiful UI**: Authentic Hindi interface with cultural colors

### 🎯 Advanced Features
- **Sankalp (Vow) System**: Set and track spiritual goals
- **Mantra Library**: Complete mantras with meanings and guided chanting
- **Meditation Timer**: Built-in timer with breathing guidance
- **Streak Tracking**: Maintain daily practice streaks
- **Share Achievements**: Share your spiritual progress with family

### 🔮 Coming Soon
- Cloud sync across devices
- Widget support
- Apple Watch & Wear OS apps
- Voice-guided chanting
- Community challenges

## 📱 Screenshots

<div align="center">
  <img src="docs/screenshots/home.png" width="200" alt="Home Screen" />
  <img src="docs/screenshots/mantras.png" width="200" alt="Mantras" />
  <img src="docs/screenshots/meditation.png" width="200" alt="Meditation" />
  <img src="docs/screenshots/settings.png" width="200" alt="Settings" />
</div>

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Android Studio (for Android)
- Xcode (for iOS, Mac only)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/jap-mala-app.git
cd jap-mala-app
```

2. **Install dependencies**
```bash
npm install
# OR
yarn install
```

3. **iOS Setup** (Mac only)
```bash
cd ios
pod install
cd ..
```

### Running the App

#### Android
```bash
# Start Metro bundler
npx react-native start

# In another terminal, run
npx react-native run-android
```

#### iOS (Mac only)
```bash
npx react-native run-ios
```

#### Web
```bash
cd web
npm start
```

## 🏗️ Project Structure

```
jap-mala-app/
├── src/
│   ├── components/     # Reusable components
│   ├── screens/        # Screen components
│   ├── utils/          # Helper functions
│   ├── constants/      # App constants
│   └── assets/         # Images, sounds, fonts
├── android/            # Android-specific code
├── ios/                # iOS-specific code
├── web/                # Web app (React)
├── docs/               # Documentation
└── App.js              # Main app entry point
```

## 🛠️ Technology Stack

- **Frontend**: React Native 0.72+
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation 6
- **Storage**: AsyncStorage
- **UI Components**: Custom components with React Native Elements
- **Animations**: React Native Reanimated
- **Icons**: React Native Vector Icons

## 📚 Documentation

- [Master Plan](docs/master_plan.md) - Complete product documentation
- [Setup Guide](docs/setup.md) - Detailed setup instructions
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [API Documentation](docs/api.md) - Backend API docs (coming soon)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use ES6+ syntax
- Follow React Native best practices
- Add comments for complex logic
- Test on both iOS and Android
- Ensure Hindi text displays correctly

## 📦 Building for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### iOS IPA
```bash
cd ios
xcodebuild -workspace JapMalaApp.xcworkspace -scheme JapMalaApp -configuration Release
```

### Web Build
```bash
cd web
npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
```bash
npx react-native start --reset-cache
```

2. **Android build fails**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

3. **iOS build fails**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

See [Troubleshooting Guide](docs/troubleshooting.md) for more solutions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by traditional mala counting practices
- Icons from [React Native Vector Icons](https://oblador.github.io/react-native-vector-icons/)
- Sound effects from [Freesound](https://freesound.org/)

## 📞 Support

- 📧 Email: support@japmala.app
- 💬 Discord: [Join our community](https://discord.gg/japmala)
- 📱 WhatsApp: [Support Group](https://wa.me/1234567890)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=YOUR_USERNAME/jap-mala-app&type=Date)](https://star-history.com/#YOUR_USERNAME/jap-mala-app&Date)

---

<div align="center">
  <h3>🕉️ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः 🕉️</h3>
  <p>May all beings be happy, may all beings be free from illness</p>
  <br/>
  <p>Made with ❤️ and devotion</p>
</div>