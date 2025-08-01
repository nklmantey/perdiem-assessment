# Store Opening Notification System

A React Native/Expo application for my Perdiem assessment. Integrates authentication with external API and Google Oauth, as well as handling data and lists.

## 🚀 Setup and Run Instructions

### Prerequisites

- Node.js (v16 or higher)
- Yarn or npm
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

```bash
# Clone the repository
git clone https://github.com/nklmantey/perdiem-assessment
cd perdiem-assessment

# Install dependencies
yarn install

# Start the development server
yarn start

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

### Environment Setup

Ensure you have the following environment variables configured:

```env
# Add to your .env file to set up Firebase
EXPO_PUBLIC_API_KEY=,
EXPO_PUBLIC_AUTH_DOMAIN=,
EXPO_PUBLIC_PROJECT_ID=,
EXPO_PUBLIC_STORAGE_BUCKET=,
EXPO_PUBLIC_MESSAGING_SENDER_ID=,
EXPO_PUBLIC_APP_ID=,
EXPO_PUBLIC_WEB_CLIENT_ID=,
```

### Notification Permissions

The app will automatically request notification permissions on first launch. Ensure you grant permissions to receive store opening reminders.

## 📋 Assumptions and Limitations

### Assumptions

- **Store Schedule Data**: Assumes store schedule data is available via `useStoreSchedule()` hook
- **Override System**: Assumes store overrides can be fetched via API calls
- **Timezone Handling**: Currently uses the same opening time for both NYC and local timezones (future enhancement needed)
- **Notification Timing**: Notifications are scheduled exactly 1 hour before store opening
- **Data Freshness**: Assumes store override data is more accurate than regular schedule data

### Limitations

- **Single Timezone Calculation**: The `findNextStoreOpening` function doesn't currently handle timezone differences between NYC and local time
- **Notification Persistence**: Notifications are cleared when the app is closed (could be enhanced with background processing)
- **Override Priority**: Only the latest override for a date is used (could be enhanced to handle multiple overrides)
- **Future Notifications**: Only schedules notifications for today's openings (not for future days)
- **Network Dependency**: Requires network connection to fetch store overrides

## 🏗️ Notes on Approach

### Architecture Overview

The notification system is built using a custom React hook (`useStoreNotification`) that provides:

1. **Caching**: Prevents unnecessary recalculations and API calls
2. **Timezone Support**: Handles both NYC and local timezone preferences
3. **Override Handling**: Waits for store override data before scheduling notifications
4. **Today-Only Logic**: Only schedules notifications for same-day store openings

### Key Components

#### `useStoreNotification` Hook

```typescript
export function useStoreNotification(
	storeTimes: any[],
	storeOverrides: Record<string, any> = {},
	timezone: 'nyc' | 'local' | null,
	overridesLoading: boolean = false
)
```

**Features:**

- **Change Detection**: Uses `useRef` to track data changes and only updates when necessary
- **Loading State Management**: Waits for `overridesLoading` to complete before processing
- **Dual Timezone Support**: Maintains separate notification caches for NYC and local
- **Automatic Cleanup**: Cancels existing notifications before scheduling new ones

#### Notification Scheduling Logic

```typescript
// Only schedule if:
// 1. Notification time is in the future
// 2. Opening is today (not for future days)
if (notificationTime > now && isToday) {
	// Schedule notification
}
```

### Data Flow

1. **Store Schedule Load**: Regular store hours are loaded
2. **Override Fetch**: Store overrides are fetched for upcoming dates
3. **Next Opening Calculation**: `findNextStoreOpening` determines the next opening time
4. **Notification Scheduling**: Notifications are scheduled 1 hour before opening
5. **Cache Update**: Notification cache is updated with new data

### Caching Strategy

- **Store Times**: Cached to prevent unnecessary recalculations
- **Store Overrides**: Cached to avoid repeated API calls
- **Timezone**: Tracked to handle timezone changes
- **Notification IDs**: Stored to enable cancellation of old notifications

### Error Handling

- **Graceful Degradation**: If notifications fail, the app continues to function
- **Console Logging**: Comprehensive logging for debugging
- **Fallback Logic**: Falls back to regular schedule if overrides fail

## 🎥 Demo Video

Watch the implementation in action: [Loom Demo](https://www.loom.com/share/825a27dae9cb443da1160a665c5212ae?sid=3ba5cc08-a4f0-4c46-8b1e-d8bdefd88909)
