module.exports = {
  plugins: {
    'postcss-import': {},
    'autoprefixer': {
      browsers: ['last 2 versions']
    },
    'postcss-preset-env': {
      stage: 1,
      browsers: 'last 2 versions'
    }
  }
}
