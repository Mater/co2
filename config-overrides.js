module.exports = function override(config) {
  return Object.assign(config, {
    externals: Object.assign(config.externals || {}, {
      serialport: 'require("serialport")'
    })
  });
};
