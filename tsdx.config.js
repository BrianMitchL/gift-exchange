module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    // keep the filenames consistent
    if (options.format === 'umd') {
      config.output.file = config.output.file.replace('giftexchange', 'gift-exchange');
    }
    return config;
  },
};
