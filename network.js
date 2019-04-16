const Axios = require('axios');

const network = {
    async getBlock(hash, baseURL) {
        const result = await Axios.get(baseURL + '/block/' + hash);
        return result.data
    },

    async getBinBlock(hash, baseURL) {
        const result = await Axios.get(baseURL + '/binblock/' + hash, {responseType: 'arraybuffer'});
        return result.data
    },

    async getSettings(baseURL) {
        const result = await Axios.get(baseURL + '/settings');
        return result.data
    }
};

module.exports = network;
