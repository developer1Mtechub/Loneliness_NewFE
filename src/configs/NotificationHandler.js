import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { requestUserPermission } from './firebaseConfig';



const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const foregroundNotificationListener = () => {
    requestUserPermission();
    return messaging().onMessage(async remoteMessage => {
        console.log('A new FCM message arrived!', remoteMessage);

        PushNotification.localNotification({
            // channelId: "testing-channal-id",
            title: remoteMessage.notification.title,
            message: remoteMessage.notification.body,
        });
    });
};



export const backgroundMessageHandler = () => {
    requestUserPermission();
    return messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!.... handler', remoteMessage);

        PushNotification.localNotification({
            id: generateUniqueId(),
            // channelId: "testing-channal-id", // (required for Android)
            title: remoteMessage.notification?.title,
            message: remoteMessage.notification?.body,
            // You can add other options here as per your needs
        });
    });
};
