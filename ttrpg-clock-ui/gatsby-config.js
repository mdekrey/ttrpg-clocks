module.exports = {
	plugins: [
		`gatsby-plugin-postcss`,
		`gatsby-plugin-react-helmet`,
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
		{
			resolve: "gatsby-plugin-react-svg",
			options: {
				rule: {
					include: /\.svg$/,
				},
			},
		},
	],
	proxy: {
		prefix: "/api",
		url: "http://localhost:7071",
	},
};
