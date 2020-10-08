const loadSC = require('./sc_loader');
const CryptoLib = require('./crypto-lib');
const AddressAPI = require('./address-lib');
const NetworkAPI = require('./network-lib');
const Bitcoin = require('bitcoinjs-lib');
const TransactionsLib = require('./transactions-lib');

function _sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const register = async (email, password, authAddress, chain) => {
    if (email === '' || password === '') {
        throw new Error('Введите регистрационные данные');
    }

    await NetworkAPI.setChain(chain);
    const keyPair = Bitcoin.ECPair.makeRandom();
    const wif = keyPair.toWIF();

    const tx = await TransactionsLib.composeRegisterTX(chain, wif);
    const registerResult = await NetworkAPI.askBlockchainTo('CREATE_TRANSACTION', {data: {tx}});

    let address = '';
    let count = 0;
    do {
        count++;

        const status = await NetworkAPI.askBlockchainTo('GET_TRANSACTION_STATUS', {txId: registerResult.txid});
        if (status && status.error) {
            throw new Error(`Ошибка создания аккаунта: ${status.res}`);
        }

        address = (status && status.ok) ? status.res : '';

        if (count > 60) {
            throw new Error("Таймаут создания аккаунта");
        }

        await _sleep(500);
    } while (address === '');

    const feeSettings = await NetworkAPI.getFeeSettings();
    const index = CryptoLib.generateIndex(email, password);
    const encWIF = CryptoLib.encryptWif(wif, `${email}${password}`);
    const encData = CryptoLib.encryptAccountDataToPEM(JSON.stringify({}), `${email}${password}`);

    const indexTx = TransactionsLib.composeAuthTX(address, authAddress, [index, encWIF, encData], 'SK', 20000, wif, feeSettings);
    await NetworkAPI.sendTxAndWaitForResponse(indexTx);

    return {address, encWIF};
}

const login = async (email, password, authAddress, chain) => {
    await NetworkAPI.setChain(chain);
    const smartContract = await loadSC(authAddress);
    const index = CryptoLib.generateIndex(email, password);
    const accData = await smartContract.executeMethod('get_wrapper', [index]);

    if (accData.length === 0) {
        throw new Error('Неверный логин или пароль')
    }

    const address = AddressAPI.encodeAddress(accData[0]).txt;
    const wif = CryptoLib.decryptWif(accData[1], `${email}${password}`);
    const encWif = CryptoLib.encryptWif(wif, password);

    return {address, encWif};
}

module.exports = {login, register};
