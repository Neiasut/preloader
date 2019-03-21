module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);
  const presets = [
    '@babel/typescript',
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead'
      }
    ]
  ];
  const plugins = ['@babel/plugin-proposal-class-properties'];

  return {
    presets,
    plugins
  };
};
