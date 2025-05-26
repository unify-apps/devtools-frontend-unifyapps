const {
	terser,
} = require("../../../node_modules/rollup-plugin-terser/rollup-plugin-terser.js");

function isEnvVarTrue(envVar) {
	return envVar === "true";
}

export default {
	input: "src/index.js",
	treeshake: false,
	output: {
		file: "dist/chii_app.js",
		format: "cjs",
		inlineDynamicImports: true,
	},
	plugins: !isEnvVarTrue(process.env.DEBUG_INJECTED) ? [terser()] : [],
};
