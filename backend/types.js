// backend/types.js

/**
 * @typedef {Object} CoinData
 * @property {string} id
 * @property {string} symbol
 * @property {string} name
 * @property {number} current_price
 * @property {string} image
 * @property {number} price_change_percentage_24h
 * @property {{ price: number[] }} [sparkline_in_7d]
 */


export const AlertCondition = {
  ABOVE: "ABOVE",
  BELOW: "BELOW",
};

/**
 * @typedef {Object} CryptoAlert
 * @property {string} [id] - Optional for Firestore auto-gen
 * @property {string} coinId
 * @property {string} coinName
 * @property {string} symbol
 * @property {"ABOVE"|"BELOW"} condition
 * @property {number} threshold
 * @property {number} createdAt
 * @property {boolean} triggered
 * @property {string} contactInfo
 * @property {"Email"|"SMS"} notificationMethod
 */

/**
 * @typedef {Object} NotificationLog
 * @property {string} [id]
 * @property {string} alertId
 * @property {string} message
 * @property {number} timestamp
 * @property {string} coinId
 * @property {"SENT"|"FAILED"|"LOGGED"} status
 * @property {"Email"|"SMS"|"Console"} method
 */
