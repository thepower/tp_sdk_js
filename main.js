//const addressLib = require('./address-lib');
const {packAndSignTX, composeSCMethodCallTX, composeStoreTX} = require('./transactions-lib');
const {sendTxAndWaitForResponse, getFeeSettings, setChain} = require('./network-lib');
const scInterface = require('./sc_interface');
//const scLoader = require('./sc_loader');
const {decryptWif} = require('./crypto-lib');
const accountLib = require('./account-lib');
const msgPack = require('./tp_msgpack/msgpack-lite');

const loadFeeSettings = async (chain) => {
    await setChain(chain);
    return await getFeeSettings();
}

const loadScLocal = (code, state = {}, balance = {}) => new scInterface(code, msgPack.encode(state), balance);

module.exports = {
    ...accountLib,
    decryptWif,
    packAndSignTX,
    loadFeeSettings,
    composeSCMethodCallTX,
    composeStoreTX,
    sendTxAndWaitForResponse,
    loadScLocal
};
