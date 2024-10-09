import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, LogBox } from 'react-native';
import { AlertProvider } from './src/providers/AlertContext';
import DynamicAlert from './src/components/DynamicAlert';
import { theme } from './src/assets';
import Root from './src/navigations/Root';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/store';
import { StripeProvider } from '@stripe/stripe-react-native';
import { refreshToken } from './src/redux/AuthModule/refreshTokenSlice';
import { updateToken, updateUserLoginInfo } from './src/redux/AuthModule/signInSlice';
import CustomModal from './src/components/CustomModal';
import { warningImg } from './src/assets/images';
import { setWarningContent } from './src/redux/warningModalSlice';
import { scaleHeight } from './src/styles/responsive';
import { STRIPE_KEY } from '@env'
import { backgroundMessageHandler, foregroundNotificationListener } from './src/configs/NotificationHandler';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from './src/utils/navigationRef';
import { SCREENS } from './src/constant/constants';
import { resetNavigation } from './src/utils/resetNavigation';
import { setRoute } from './src/redux/appSlice';
import { setNewNotification } from './src/redux/newNotificationSlice';
import { resetState } from './src/redux/BuddyDashboard/userLikesDetailSlice';

const MainApp = () => {
  const dispatch = useDispatch();
  const { userLoginInfo, role } = useSelector((state) => state.auth);
  const { warningContent } = useSelector((state) => state.warningContent);
  const { expires_at } = userLoginInfo || {};


  PushNotification.configure({
    onNotification: function (notification) {
      console.log('LOCAL NOTIFICATION ==>', notification);
      dispatch(setNewNotification(true))

      if (notification.userInteraction) {
        if (notification?.data?.type === "SERVICES" || notification?.data?.type === "PAYMENT" || notification?.data?.type === "Service Completed") {
          const routePayload = {
            request_id: notification?.data?.request_id,
            route: SCREENS.MAIN_DASHBOARD
          }
          dispatch(setRoute(routePayload))
          if (role === "USER") {
            navigationRef.reset({
              index: 0,
              routes: [{ name: SCREENS.USER_SERVICE_DETAIL }],
            });
          } else {
            navigationRef.reset({
              index: 0,
              routes: [{ name: SCREENS.BUDDY_SERVICE_DETAIL }],
            });
          }

        } else if (notification?.data?.type === "CHAT") {
          dispatch(resetState());
          dispatch(setRoute({
            route: SCREENS.MAIN_DASHBOARD,
            receiver_id: notification?.data?.sender_id,
            isNoti: true
          }));
          navigationRef.reset({
            index: 0,
            routes: [{ name: SCREENS.GENERAL_CHAT }],
          });
        }
      }


    },
    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATIONS:", notification);
      // Process the action here
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true
  });


  useEffect(() => {
    const TOKEN_REFRESH_PERIOD = 1; // days

    const checkTokenExpiry = async () => {
      const currentTime = new Date().getTime();
      const expiresAt = parseInt(expires_at, 10);

      if (currentTime >= expiresAt) {
        console.log('Token expired..');
        dispatch(refreshToken()).then((result) => {
          const { status, message, result: refreshResult } = result?.payload;
          var { token, tokenExpiresIn, refreshToken } = refreshResult;
          if (status === "success") {
            // Update expiry date to 1 days from now
            const newExpiryDate = new Date();
            newExpiryDate.setDate(newExpiryDate.getDate() + TOKEN_REFRESH_PERIOD);

            const updatedRefreshToken = {
              token: token,
              refreshToken: refreshToken?.refreshToken,
              tokenExpiresIn: `${tokenExpiresIn}`,
              expires_at: newExpiryDate.getTime()
            };
            dispatch(updateToken(updatedRefreshToken));
          }
        });
      } else {
        console.log('Token not expired yet..');
      }
    };

    checkTokenExpiry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleResetModalContent = () => {
    dispatch(setWarningContent(false))
  }

  const renderWarningModal = useCallback(() => {
    return (
      <CustomModal
        isVisible={warningContent.modalVisible}
        onClose={handleResetModalContent}
        headerTitle={"Warnings!"}
        imageSource={warningImg}
        text={warningContent.description}
        buttonText="OK"
        isParallelButton={false}
        isCross={true}
        customModalStyle={{ width: '100%' }}
        modalCustomTextStyle={{
          textAlign: 'strech',
        }}
        buttonAction={() => {
          handleResetModalContent();
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warningContent]);

  useEffect(() => {
    const unsubscribeBackground = backgroundMessageHandler();
    const unsubscribeForeground = foregroundNotificationListener();

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      dispatch(setNewNotification(true))
      if (remoteMessage?.notification?.data?.type === "SERVICES"
        || remoteMessage?.notification?.data?.type === "PAYMENT" ||
        remoteMessage?.notification?.data?.type === "Service Completed") {
        const routePayload = {
          request_id: remoteMessage?.notification?.data?.request_id,
          route: SCREENS.MAIN_DASHBOARD
        }
        dispatch(setRoute(routePayload))
        if (role === "USER") {
          navigationRef.reset({
            index: 0,
            routes: [{ name: SCREENS.USER_SERVICE_DETAIL }],
          });
        } else {
          navigationRef.reset({
            index: 0,
            routes: [{ name: SCREENS.BUDDY_SERVICE_DETAIL }],
          });
        }

      } else if (remoteMessage?.notification?.data?.type === "CHAT") {
        dispatch(resetState());
        dispatch(setRoute({
          route: SCREENS.MAIN_DASHBOARD,
          receiver_id: remoteMessage?.notification?.data?.sender_id,
          isNoti: true
        }));
        navigationRef.reset({
          index: 0,
          routes: [{ name: SCREENS.GENERAL_CHAT }],
        });
      }
      // handleNotificationTap(remoteMessage.notification);
      //handle notification click
    });

    return () => {
      if (unsubscribeBackground) unsubscribeBackground();
      if (unsubscribeForeground) unsubscribeForeground();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.dark.background}
        barStyle="light-content"
      />
      <Root />
      <DynamicAlert />
      {renderWarningModal()}
    </View>
  );

}

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AlertProvider>
          <StripeProvider publishableKey={STRIPE_KEY}>
            <MainApp />
          </StripeProvider>
        </AlertProvider>
      </PersistGate>
    </Provider>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark.background
  },
});

export default App;
