module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Path to your tsconfig.json
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  // Additional configurations...
};
