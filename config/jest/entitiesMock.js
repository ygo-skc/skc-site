// Wired up by jest.moduleNameMapper in package.json.
// Stubs `entities`, which is ESM-only and so cannot be required by Jest.
module.exports = {
	decodeHTML: (text) => text,
	decodeXML: (text) => text,
	encodeHTML: (text) => text,
	escape: (text) => text,
}
