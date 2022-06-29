module.exports = {
  // 'extends': '@istanbuljs/nyc-config-typescript',
  'all': true,
  'include': ['src/**/*.ts'],
  'extension': ['.ts', '.tsx'],
  'check-coverage': true,
  'reporter': ['lcov', 'text'],
  'sourceMap': true,
  'instrument': true,
  'require': ['ts-node/register'],
}
