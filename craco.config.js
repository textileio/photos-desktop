module.exports = {
  babel: {
    presets: ['mobx'],
    plugins: [
      ['babel-plugin-styled-components'],
      ['@babel/plugin-proposal-decorators', { 'legacy': true }],
      ['@babel/plugin-proposal-class-properties', { 'loose': true }]
    ]
  }
}
