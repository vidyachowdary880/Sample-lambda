module.exports = {
  //preset: 'ts-jest',
  //testEnvironment: 'node',
  transform: {
    "^.+\\.tsx?$":  "ts-jest",
  },
  testRegex:  "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["ts",  "tsx",  "js",  "jsx",  "json",  "node"],
  collectCoverage:  true,
  transformIgnorePatterns: [
    '/node_modules/@babel',
    '/node_modules/@jest',
  ],
};