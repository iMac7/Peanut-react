module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest" // Make sure Babel handles file transformations
    }
  };
  