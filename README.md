# Expo App Setup Guide

This guide will walk you through setting up and running the Expo app locally.

## Prerequisites

1. **Node.js and npm**: Ensure that Node.js and npm are installed on your machine. You can download them [here](https://nodejs.org/).
2. **Expo Go App**: Install the **Expo Go** app on your mobile device:
   - [Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [Apple App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)

---

## Steps to Run the App

### 1. Clone the Repository
Clone the project repository to your local machine:
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies
Install the required dependencies:
```bash
npm install
```

### 3. Configure the Base URL
Set the `baseURL` in `constants.ts` to your **local Wi-Fi IP address** (the IP address your phone and computer share on the same network).

To find your Wi-Fi IP:
- On macOS/Linux, run `ifconfig` or `ipconfig`.
- On Windows, run `ipconfig`.

Example configuration in `constants.ts`:
```ts
export const baseURL = "http://192.168.x.x";
```

### 4. Start the Expo Development Server
Start the Expo development server by running:
```bash
npx expo start
```

### 5. Connect to the App on Your Mobile Device
1. Ensure your mobile device is connected to the same Wi-Fi network as your computer.
2. Open the **Expo Go** app on your phone.
3. Scan the QR code displayed in the terminal or on the Expo DevTools webpage.

---

## Troubleshooting

- **QR Code Not Working**: Ensure your computer and phone are on the same network.
- **App Not Loading**: Verify that the `baseURL` in `constants.ts` is correctly set to your local Wi-Fi IP.
- **Dependencies Issue**: Run `npm install` again to ensure all dependencies are installed properly.

---

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Troubleshooting Expo Go](https://docs.expo.dev/workflow/common-development-errors/)
