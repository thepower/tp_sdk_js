//const addressLib = require('./address-lib');
const {packAndSignTX, composeSCMethodCallTX} = require('./transactions-lib');
const {sendTxAndWaitForResponse, getFeeSettings, setChain} = require('./network-lib');
//const scInterface = require('./sc_interface');
const scLoader = require('./sc_loader');
const {decryptWif} = require('./crypto-lib');
const accountLib = require('./account-lib');

const loadFeeSettings = async (chain) => {
    await setChain(chain);
    return await getFeeSettings();
}

module.exports = {
    ...accountLib,
    decryptWif,
    packAndSignTX,
    loadFeeSettings,
    composeSCMethodCallTX,
    sendTxAndWaitForResponse
};
