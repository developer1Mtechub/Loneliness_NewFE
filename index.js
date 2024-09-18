/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { store } from './src/redux/store';
import { setNewNotification } from './src/redux/newNotificationSlice';

const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Configure PushNotification
PushNotification.configure({
    onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION ==>', notification);
        // Process the notification
    },
    requestPermissions: true,
});

PushNotification.createChannel(
    {
      channelId: generateUniqueId(), // Ensure this matches the ID used in localNotification
      channelName: generateUniqueId(), // Descriptive name for the channel
      channelDescription: "A channel for testing notifications", // Description
      soundName: "default", // Sound for notifications
      importance: 4, // High importance
      vibrate: true, // Vibration
    },
    (created) => console.log(`createChannel returned '${created}'`)
  );

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!.... index', remoteMessage);
    store.dispatch(setNewNotification(true));
    PushNotification.localNotification({
        id: generateUniqueId(),
        // channelId: "testing-channal-id", // (required for Android)
        title: remoteMessage.notification?.title,
        message: remoteMessage.notification?.body,
        // You can add other options here as per your needs
    });
});

AppRegistry.registerComponent(appName, () => App);
