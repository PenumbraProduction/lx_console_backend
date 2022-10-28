/* 
 *  This is the default license template.
 *  
 *  File: .prettierrc.js
 *  Author: Owner
 *  Copyright (c) 2022 Owner
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

"use strict";

module.exports = {
	useTabs: true,
	tabWidth: 4,
	printWidth: 160,
	semi: true,
	singleQuote: false,
	trailingComma: "none",
	bracketSpacing: true,
	arrowParens: "always",
	embeddedLanguageFormatting: "auto",

	overrides: [
		{
			files: ["**.latex.js"],
			options: {
				useTabs: false,
				tabWidth: 2
			}
		}
	]
};
