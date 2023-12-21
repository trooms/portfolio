module.exports = {
  siteMetadata: {
    // Site URL for when it goes live
    siteUrl: `https://trooms.dev`,
    // Your Name
    name: 'Truman Costello',
    // Main Site Title
    title: `Truman Costello`,
    // Description that goes under your name in main bio
    description: `PhD Candidate in Computer Science at the University of Glasgow.`,
    // Optional: Twitter account handle
    author: `Truman Costello`,
    // Optional: Github account URL
    github: `https://github.com/claretb`,
    // Optional: LinkedIn account URL
    linkedin: `https://www.linkedin.com/in/talhayranci/`,
    // Content of the About Me section
    about: `I am a second-year PhD student in Computing Science at the University of Glasgow, under the supervision of Dr. Jonathan Grizou and Dr. Mireilla Bikanga Ada. My research focuses on tangible machine learning education.
            \nApart from research, I like writing blogs, watching and playing football and exploring the beautiful places of Scotland. I also have a beginner's level interest in the philosophy of science.`,
    extendedAbout: `You can find a brief overview of my background below. For a detailed CV, please click the resume link below.
                    \nDon't hesitate to reach out to me through any of the contact channels above. I'm always open to engaging in discussions and sharing thoughts with others. Feel free to start conversations on any topics that align with my interests.`,
    resumeLink: `https://drive.google.com/file/d/1_A4i1nKKJrhQVOx2BnGrbZmcEqf9Y_90/view?usp=drive_link`,
    // Optional: List your projects, they must have `name` and `description`. `link` is optional.
    updates: [
      {
        date: '15/09/2023',
        name: 'My new website is live!',
        description:
          'As you can see now, I renewed my personal website. It is now more informative and minimalistic.',
      },
      {
        date: '29/08/2023',
        name: '🎉 I have passed my first APR!',
        description:
          'Although I need to do some changes on my report, I am now a second year PhD.',
      },
    ],
    // Optional: List your education, they must have `name` and `description`. `link` is optional.
    education: [
      {
        date: 'Nov 2022 - Present',
        name: 'Doctor of Philosophy',
        description: 'School of Computing Science, University of Glasgow',
      },
      {
        date: 'Sep. 2021 - Sep 2022',
        name: "Master's Degree",
        description:
          'Robotics and Artificial Intelligence, University of Glasgow',
      },
      {
        date: 'Jul. 2015 - Jun. 2019',
        name: "Bachelor's Degree",
        description: 'Computer Engineering, Konya Technical University',
      },
    ],
    // Optional: List your experience, they must have `name` and `description`. `link` is optional.
    experience: [
      {
        date: 'Sep 2023 - Present',
        name: 'Teaching Assistant',
        description: 'University of Glasgow',
      },
      {
        date: 'Jun 2023 - Present',
        name: 'Software Developer',
        description: 'University of Glasgow Software Services',
      },
      {
        date: 'Feb 2020 - Sep 2021',
        name: 'Software Engineer',
        description: 'PostDICOM, Medical Image Processing',
      },
    ],
    // Optional: List your skills, they must have `name` and `description`.
    // skills: [
    //   {
    //     name: 'Languages & Frameworks',
    //     description:
    //       'JavaScript (ES6+), Golang, Node.js, Express.js, React, Ruby on Rails, PHP',
    //   },
    //   {
    //     name: 'Databases',
    //     description: 'MongoDB, PostreSQL, MySQL',
    //   },
    //   {
    //     name: 'Other',
    //     description:
    //       'Docker, Amazon Web Services (AWS), CI / CD, Microservices, API design, Agile / Scrum',
    //   },
    // ],
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
        name: `talhayranci.com`,
        short_name: `talhayranci.com`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`, // This color appears on mobile
        display: `minimal-ui`,
        icon: `src/images/icon.png`,
      },
    },
  ],
};