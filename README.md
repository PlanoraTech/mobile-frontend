# Planora Mobile Application

<div align="center">
  <img src="./assets/images/planora-logo.svg" alt="Planora Logo" width="200" />
</div>

## Overview

Planora is a comprehensive timetable and event management mobile application designed for educational institutions. It helps students, teachers, and administrators efficiently manage their schedules, appointments, and events.

## Features

- **Timetable Management**: View and manage class schedules and appointments
- **Event Planning**: Create and manage events
- **Room Management**: View and change room assignments
- **Presenter Management**: Manage class presenters with substitution capabilities
- **User Authentication**: Secure login and registration system
- **Profile Management**: User profile customization and preferences
- **Dark/Light Theme**: Adaptive UI with support for both dark and light themes
- **Push Notifications**: Get notified about schedule changes and important events
- **Offline Support**: Basic functionality even without an internet connection

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context API
- **API Requests**: TanStack React Query
- **UI Components**: React Native Paper
- **Storage**: AsyncStorage, Expo Secure Store
- **Date Handling**: date-fns
- **Testing**: Jest and React Testing Library
- **Icons**: Expo Vector Icons, Lucide React Native
- **Animations**: React Native Reanimated

## Screenshots

*[Screenshots will be added here]*

## Prerequisites

- Node.js (>=14.0.0)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/planora-mobile.git
   cd planora-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Run on a device or emulator:
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## Project Structure

```
app/                  # Main application screens and navigation
assets/               # Images, styles, and assets
components/           # Reusable UI components
contexts/             # React Context providers
hooks/                # Custom React hooks
utils/                # Utility and helper functions
__tests__/            # Test files
android/              # Android-specific configuration
```

## Testing

Run tests using:

```bash
npm test
# or
yarn test
```

## Building for Production

Build the application for production using EAS Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Configure your build
eas build:configure

# Build for Android
eas build -p android

# Build for iOS
eas build -p ios
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Made with ❤️ by the Planora Team