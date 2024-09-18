// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appReducer from './appSlice';
import signInReducer from './AuthModule/signInSlice';
import signupReducer from './AuthModule/signupSlice';
import updateProfileReducer from './AuthModule/updateProfileSlice';
import verifyEmailReducer from './AuthModule/verifyEmailSlice';
import verifyEmailCodeReducer from './AuthModule/verifyEmailCodeSlice';
import resetPasswordReducer from './AuthModule/resetPasswordSlice';
import createConnectedAccountReducer from './PaymentSlices/createConnectedAccountSlice';
import accountOnboardingReducer from './PaymentSlices/accountOnboardingSlice';
import checkStripeFilledStatusReducer from './PaymentSlices/checkStripeFilledStatusSlice';
import setTempCredentialsReducer from './setTempCredentialsSlice';
import getAllNearbyBuddyReducer from './UserDashboard/getAllNearbyBuddySlice';
import getAddressByLatLongReducer from './getAddressByLatLongSlice';
import getAllCategoriesReducer from './getAllCategoriesSlice';
import getLanguagesReducer from './getLanguagesSlice';
import appOpenedReducer from './appOpenedSlice';
import sendRequestReducer from './UserDashboard/sendRequestSlice';
import likeDislikeBuddyReducer from './UserDashboard/likeDislikeBuddySlice';
import userBuddyActionReducer from './userBuddyActionSlice';
import applyFilterTogetBuddiesReducer from './UserDashboard/applyFilterTogetBuddiesSlice';
import accountSubscriptionReducer from './accountSubscriptionSlice';
import getAllBuddyRequestRequest from './BuddyDashboard/getAllBuddyRequestSlice';
import acceptRejectUserRequestReducer from './BuddyDashboard/acceptRejectUserRequestSlice';
import getRequestByIdReducer from './BuddyDashboard/getRequestByIdSlice';
import requestBackBuddyReducer from './BuddyDashboard/requestBackBuddySlice';
import getAllSubscriptionReducer from './getAllSubscriptionSlice';
import createCustomerReducer from './PaymentSlices/createCustomerSlice';
import attachPaymentMethodReducer from './PaymentSlices/attachPaymentMethodSlice';
import payToSubscribeReducer from './PaymentSlices/payToSubscribeSlice';
import getRatingReducer from './UserDashboard/getRatingSlice';
import getAllNotificationsReducer from './getAllNotificationsSlice';
import getAllServiceRequestsReducer from './UserDashboard/getAllServiceRequestsSlice';
import getBuddyDetailByIdReducer from './UserDashboard/getBuddyDetailByIdSlice';
import acceptRejectBuddyRequestReducer from './UserDashboard/acceptRejectBuddyRequestSlice';
import rateToBuddyReducer from './UserDashboard/rateToBuddySlice';
import releasePaymentReducer from './UserDashboard/releasePaymentSlice';
import cancelPaymentReducer from './UserDashboard/cancelPaymentSlice';
import cardWalletPaymentTransferReducer from './UserDashboard/cardWalletPaymentTransferSlice';
import getAllBuddyServicesReducer from './BuddyDashboard/getAllBuddyServicesSlices';
import getUserDetailByServiceReducer from './BuddyDashboard/getUserDetailByServiceSlice';
import getServiceRatingReducer from './getServiceRatingSlice';
import actionCancelPaymentReducer from './BuddyDashboard/actionCancelPaymentSlice';
import requestForPaymentReducer from './BuddyDashboard/requestForPaymentSlice';
import setIndexesReducer from './setIndexesSlice';
import getTransactionHistoryReducer from './PaymentSlices/getTransactionHistorySlice';
import withdrawAmountReducer from './PaymentSlices/withdrawAmountSlice';
import getLikesReducer from './BuddyDashboard/getLikesSlice';
import userLikesDetailReducer from './BuddyDashboard/userLikesDetailSlice';
import changePasswordReducer from './AuthModule/changePasswordSlice';
import getPolicyTermsReducer from './getPolicyTermsSlice';
import deleteAccountReducer from './deleteAccountSlice';
import checkChatPaymentReducer from './PaymentSlices/checkChatPaymentSlice';
import unReadCountReducer from './unReadCountSlice';
import currentUserIndexReducer from './currentUserIndexSlice';
import cancelSubscriptionReducer from './PaymentSlices/cancelSubscriptionSlice';
import notificationsReducer from './notificationsSlice';
import rememberMeReducer from './rememberMeSlice';
import checkStripeRequirementsReducer from './PaymentSlices/checkStripeRequirementsSlice';
import refreshTokenReducer from './AuthModule/refreshTokenSlice';
import warningModalReducer from './warningModalSlice';
import verifyMeetingCodeReducer from './BuddyDashboard/verifyMeetingCodeSlice';
import uploadChatImageReducer from './uploadChatImageSlice';
import getPayPalUrlReducer from './PaymentSlices/getPayPalUrlSlice';
import executeChatPaymentReducer from './PaymentSlices/executeChatPaymentSlice';
import getPlansReducer from './PaymentSlices/getPlansSlice';
import createSubscriptionReducer from './PaymentSlices/createSubscriptionSlice';
import successSubscriptionReducer from './PaymentSlices/successSubscriptionSlice';
import checkSubscriptionExistReducer from './PaymentSlices/checkSubscriptionExistSlice';
import executePaymentRequestReducer from './PaymentSlices/executePaymentRequestSlice';
import newNotificationReducer from './newNotificationSlice';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth', 'signup', 'rememberMe', 'newNotification']  // Persist 'auth' and 'signup' slices
};

const rootReducer = combineReducers({
    newNotification: newNotificationReducer,
    auth: signInReducer,
    signup: signupReducer,
    app: appReducer,
    rememberMe: rememberMeReducer,
    setLastIndex: setIndexesReducer,
    createProfile: updateProfileReducer,
    verifyEmail: verifyEmailReducer,
    verifyEmailCode: verifyEmailCodeReducer,
    resetPassword: resetPasswordReducer,
    connectedAccount: createConnectedAccountReducer,
    accountOnboarding: accountOnboardingReducer,
    checkStripeFilledStatus: checkStripeFilledStatusReducer,
    tempCredentials: setTempCredentialsReducer,
    nearByBuddy: getAllNearbyBuddyReducer,
    getAddress: getAddressByLatLongReducer,
    getCategories: getAllCategoriesReducer,
    getLanguages: getLanguagesReducer,
    appOpened: appOpenedReducer,
    sendRequest: sendRequestReducer,
    likeDislikeBuddy: likeDislikeBuddyReducer,
    userBuddyAction: userBuddyActionReducer,
    applyFilter: applyFilterTogetBuddiesReducer,
    accountSubscription: accountSubscriptionReducer,
    getAllBuddyRequest: getAllBuddyRequestRequest,
    acceptRejectUserRequest: acceptRejectUserRequestReducer,
    getRequestById: getRequestByIdReducer,
    requestBackBuddy: requestBackBuddyReducer,
    getSubscription: getAllSubscriptionReducer,
    createCustomer: createCustomerReducer,
    attachPaymentMethod: attachPaymentMethodReducer,
    payToSubscribe: payToSubscribeReducer,
    getRating: getRatingReducer,
    getAllNotifications: getAllNotificationsReducer,
    getAllServiceRequests: getAllServiceRequestsReducer,
    getBuddyDetailById: getBuddyDetailByIdReducer,
    acceptRejectBuddyRequest: acceptRejectBuddyRequestReducer,
    rateToBuddy: rateToBuddyReducer,
    releasePayment: releasePaymentReducer,
    cancelPayment: cancelPaymentReducer,
    cardWalletPaymentTransfer: cardWalletPaymentTransferReducer,
    getAllBuddyServices: getAllBuddyServicesReducer,
    getUserDetailByService: getUserDetailByServiceReducer,
    getServiceRating: getServiceRatingReducer,
    actionCancelPayment: actionCancelPaymentReducer,
    requestForPayment: requestForPaymentReducer,
    getTransactionHistory: getTransactionHistoryReducer,
    withdrawAmount: withdrawAmountReducer,
    getLikes: getLikesReducer,
    getUserDetail: userLikesDetailReducer,
    changePassword: changePasswordReducer,
    getPolicyAndTerms: getPolicyTermsReducer,
    deleteAccount: deleteAccountReducer,
    checkChatPayment: checkChatPaymentReducer,
    unReadCount: unReadCountReducer,
    currentUserIndex: currentUserIndexReducer,
    cancelSubscription: cancelSubscriptionReducer,
    notifications: notificationsReducer,
    checkStripeRequirements: checkStripeRequirementsReducer,
    refreshToken: refreshTokenReducer,
    warningContent: warningModalReducer,
    verifyMeetingCode: verifyMeetingCodeReducer,
    uploadChatImage: uploadChatImageReducer,
    getPayPalUrl: getPayPalUrlReducer,
    executeChatPayment: executeChatPaymentReducer,
    getPlans: getPlansReducer,
    createSubscription: createSubscriptionReducer,
    successSubscription: successSubscriptionReducer,
    checkSubscriptionExist: checkSubscriptionExistReducer,
    executeRequestPayment: executePaymentRequestReducer

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
