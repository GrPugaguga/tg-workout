const nodeExternals = require('webpack-node-externals')

module.exports = (options) => ({
  ...options,
  externals: [
    nodeExternals({
      allowlist: ['typesense-ts'],
    }),
  ],
  resolve: {
    ...options.resolve,
    conditionNames: ['import', 'module', 'node', 'default'],
  },
})
