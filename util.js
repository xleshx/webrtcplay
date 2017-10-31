const os = require('os');
const _ = require('lodash');

module.exports.getServerIp = function (){
    let networkFilter = function (details) {
        return details.family === 'IPv4' && details.address !== '127.0.0.1'
    };
    const ifcs = os.networkInterfaces();
    return _.map(_.flatten(_.values(ifcs)).filter(networkFilter), rec => rec.address)[0];
};
