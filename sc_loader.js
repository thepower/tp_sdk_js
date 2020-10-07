const scApi = require('./sc_interface');
const {askBlockchainTo} = require('./network-lib');

let loadedSC = {};

const instantiateSC = async (address, chain = 8) => {
    loadedSC[address] = loadedSC[address] || new Uint8Array(await askBlockchainTo('GET_SC_CODE', {chain, address}));
    const state = new Uint8Array(await askBlockchainTo('GET_SC_STATE', {chain, address}));
    return new scApi(loadedSC[address], state);
};

module.exports = instantiateSC;
