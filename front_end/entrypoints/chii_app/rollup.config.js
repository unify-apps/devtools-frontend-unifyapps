const {
	terser,
} = require("../../../node_modules/rollup-plugin-terser/rollup-plugin-terser.js");

function isEnvVarTrue(envVar) {
	return envVar === "true";
}

export default {
	input: "./chii_app.ts",
	treeshake: false,
	output: {
		inlineDynamicImports: true,
	},
	plugins: !isEnvVarTrue(process.env.DEBUG_INJECTED) ? [terser()] : [],
};
