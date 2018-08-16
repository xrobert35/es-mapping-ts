module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./src",
  testRegex: "src\/test.*spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "typescript-babel-jest"
  },
  coverageDirectory: "../coverage"
}
