module.exports = function override(config) {
  return Object.assign(config, {
    externals: Object.assign(config.externals || {}, {
      electron: 'require("electron")',
      serialport: 'require("serialport")',
      beeper: 'require("beeper")'
    })
  });
};
