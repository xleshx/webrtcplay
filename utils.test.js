const { getServerIps } = require('./utils');

test('Returns current system network addresses', () => {
    expect(getServerIps()).toBe("192.168.2.134");
});
