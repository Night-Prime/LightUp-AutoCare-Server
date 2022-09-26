/* eslint-disable object-curly-newline */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const OneSignal = require('@onesignal/node-onesignal');
require('dotenv').config();

async function pushNotifications() {
    const userKeyProvider = {
        getToken() {
            return process.env.ONESIGNAL_REST_KEY;
        }
    };
    const appKeyProvider = {
        getToken() {
            return process.env.ONESIGNAL_APP_KEY;
        }
    };
    // configuration object
    const configuration = OneSignal.createConfiguration({
        authMethods: {
            user_key: {
                tokenProvider: userKeyProvider
            },
            app_key: {
                tokenProvider: appKeyProvider
            }
        }
    });
    client = new OneSignal.DefaultApi(configuration);

    // create Notification
    const notification = new OneSignal.Notification();
    notification.app_id = process.env.ONESIGNAL_APP_ID;
    notification.included_segments = ['Subscribed Users'];
    notification.contents = {
        en: 'Hello OneSignal!'
    };
    const { id } = await client.createNotification(notification);

    // view notification
    const response = await client.getNotification(process.env.ONESIGNAL_APP_ID, id);
    console.log(response);
}
console.log(pushNotifications);

module.exports = { pushNotifications };
