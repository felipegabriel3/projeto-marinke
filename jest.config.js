/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    global: { statements: 90, branches: 90, functions: 90, lines: 90 },
  },
};
