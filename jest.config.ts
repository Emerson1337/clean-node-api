module.exports = {
	roots: ['<rootDir>/src'],
	collectCoverageFrom: [
		'<rootDir>/src/**/*.ts', 
		'!**/Protocols/**.ts',
		'!**/Domain/**/*.ts',
		'!**/Protocols/**.ts',
	],
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	testEnvironment: 'node',
	transform: {
		'.+\\.ts$': 'ts-jest',
	},
};
