module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',  // Make sure it points to your TS config
      },
    },
    transform: {
      '^.+\\.ts?$': 'ts-jest',  // Ensure ts-jest is used to handle .ts files
    },
  };