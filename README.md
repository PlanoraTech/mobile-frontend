![Image](https://github.com/PlanoraTech/other-important-files/blob/9f8744e572874a421c6820d62750ddc49fd4d72a/planora-logo-white-github.png)
# Planora
This repository contains the mobile front of **Planora**, a comprehensive all-in-one institution management system.

## Setup

### Prerequisites

- Node.js (>=14.0.0)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

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

---

Made with ❤️ by the Planora Team
