module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts", "node"],
  rootDir: "./src",
  testRegex: "src\/test.*spec.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  coverageDirectory: "../coverage",
  coveragePathIgnorePatterns: [
    "src/test/resources"
  ],
}
