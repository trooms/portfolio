module.exports = {
  siteMetadata: {
    // Site URL for when it goes live
    siteUrl: `https://trooms.dev`,
    // Your Name
    name: 'Truman Costello',
    // Main Site Title
    title: `Truman Costello`,
    // Description that goes under your name in main bio
    description: `Computer Science, Game Development, and Applied & Computational Math @ the University of Southern California.`,
    // Optional: Github account URL
    github: `https://github.com/trooms`,
    // Content of the About Me section
    about: `I am a third-year bachelors student in Computing Science (Games) and AMCM at the University of Southern California.
            \nI'm currently working on a project focused on bringing applications of machine learning to education.
            \nApart from school, I take care of my dog Sloane and work as a server at a local off-campus restaurant 'Study Hall'.`,
    // Optional: List your education, they must have `name` and `description`. `link` is optional.
    projects: [
      {
        date: 'Feb 2023 - Present',
        name: 'Cognify',
        description: 'Education app using a stochastic shortest path algorithm for optimizing spaced repetition scheduling',
      },
    ],
    // Optional: List your experience, they must have `name` and `description`. `link` is optional.
    experience: [
      {
        date: 'May 2021 - Jul. 2021',
        name: 'IoTOne',
        description: 'UX / UI Design Fellow',
      },
      {
        date: 'Jun. 2021 - May 2021',
        name: 'Microsoft',
        description: 'Technical Resilience Mentee',
      },
    ],
    education: [
      {
        date: 'May 2025',
        name: 'B.S. Computer Science (Games), B.S. Applied & Computational Mathematics',
        description: 'Viterbi School Computing Science, School of Cinematic Arts, Dornsife College of Letters Arts & Sciences',
      },
      {
        date: 'Sep. 2019 - Mar. 2020',
        name: 'Rotary International High School Exchange Student',
        description:
          '양명고등학교',
      },
      {
        date: 'Grad. Jun. 2019',
        name: 'Healdsburg High School',
        description: 'Also attended (for a short time) Central Catholic High School in Portland, OR and Mark Morris High School in Longview, WA.'
      },
    ],
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/projects`,
        name: `project`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              wrapperStyle: `margin: 0 0 30px;`,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-postcss`,
    // `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `ADD YOUR TRACKING ID HERE`, // Optional Google Analytics
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `trooms.dev`,
        short_name: `trooms.dev`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`, // This color appears on mobile
        display: `minimal-ui`,
        icon: `src/images/icon.png`,
      },
    },
  ],
};