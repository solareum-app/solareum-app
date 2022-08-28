module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@Components': './src/components',
          '@Containers': './src/containers',
          '@Core': './src/core',
          '@Deeplink': './src/deeplink',
          '@Hooks': './src/hooks',
          '@Navigators': './src/navigators',
          '@Screens': './src/screens',
          '@SplUtils': './src/spl-utils',
          '@Storage': './src/storage',
          '@Theme': './src/theme',
          '@Utils': './src/utils',
        },
      },
    ],
  ],
};
