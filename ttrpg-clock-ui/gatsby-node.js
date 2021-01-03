/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.onCreateWebpackConfig = ({ stage, actions }) => {
	if (stage.startsWith("develop")) {
		actions.setWebpackConfig({
			resolve: {
				alias: {
					"react-dom": "@hot-loader/react-dom",
				},
			},
		});
	}
};

exports.onCreateBabelConfig = ({ actions }) => {
	// fix for React automatic imports from https://github.com/gatsbyjs/gatsby/issues/28657
	actions.setBabelPlugin({
		name: "@babel/plugin-transform-react-jsx",
		options: {
			runtime: "automatic",
		},
	});
};
