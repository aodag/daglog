module.exports = {
  // Customize your site metadata:
  siteMetadata: {
    title: `daglog`,
    author: `aodag`,
    siteUrl: "https://aodag.dev",
    description: `なんらかの記録`,
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/aodag`,
      },
      {
        name: `github`,
        url: `https://github.com/aodag`,
      },
    ],
  },
  plugins: [
    {
      resolve: `gatsby-theme-blog`,
      options: {},
    },
  ],
}
