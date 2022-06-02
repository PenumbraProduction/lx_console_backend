const path = require("path");

module.exports = {
	entry: "./src/index.ts",
    devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: "tsconfig.browser.json"
                    }
                }],
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	output: {
		filename: "myDmx.js",
		libraryTarget: "var",
		library: "myDmx",
		path: path.resolve(__dirname, "out.webpack")
	}
};
