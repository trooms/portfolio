module.exports = {
  siteMetadata: {
    // Site URL for when it goes live
    siteUrl: `https://trooms.dev`,
    // Your Name
    name: 'Truman Costello',
    // Main Site Title
    title: `Truman Costello`,
    // Description that goes under your name in main bio
    description: `Computer Science, Game Development, Mathematics @ USC`,
    // Optional: Github account URL
    github: `https://github.com/trooms`,
    // Content of the About Me section
    about: `I am in my last year as a bachelors student in Computing Science (Games) and Applied & Computational Mathematics at the University of Southern California.
            \nMy interests lie in engine programming, including but not limited to VFX, real-time rendering, animation programming, and tooling for all of the above.
            \nI've worked as a Software Engineer at Keysight Technologies and been done a Software Engineering mentorship at Microsoft, but hope to break into the film and game industry.
            \nI'm at Allison B. Margolin, PLC, a criminal defense firm, where I've started developing internal legal software for consent based digital forensics and  general quality of life improvements.
            \nApart from work and school, I'm working on two games of my own and am a part of a stealth startup.`,
    // Optional: List your education, they must have `name` and `description`. `link` is optional.
    /*projects: [
      {
        date: 'Feb 2023 - Present',
        name: 'Cognify',
        description: 'Education app using a stochastic shortest path algorithm for optimizing spaced repetition scheduling',
        tools: 'Expo (React Native) + Tauri'
      },
      {
        date: 'Oct. 2023 - Dec. 2023',
        name: 'LeetScope',
        description: 'Online code judge application based on Java/C++ code input and expected console print statements',
        tools: 'Vue.js | Java Springboot'
      },
      {
        date: 'Feb. 2021 - Jan. 2022',
        name: 'Sentiment Trading Bot',
        description: 'LSTM recurrent neural net creating expected stock price changes based on social media sentiment around a given stock',
        tools: 'Python | Pandas | PyTorch'
      },
    ],*/
    // Optional: List your experience, they must have `name` and `description`. `link` is optional.
    experience: [
      {
        date: 'Los Angeles, CA | July 2024 - Present',
        name: 'Allison B. Margolin, PLC',
        description: 'Personal Assistant',
        tools: 'Legal Writing',
        link: 'https://www.allisonmargolin.com'
      },
      {
        date: 'Remote | May 2021 - Jul. 2021',
        name: 'IoT ONE',
        description: 'UX / UI Design Fellow',
        tools: 'Figma',
        link: 'https://www.iotone.com/'
      },
      {
        date: 'Remote | Jan. 2021 - May 2021',
        name: 'Microsoft',
        description: 'Technical Resilience Mentee',
        tools: 'C++',
        link: 'https://csatuwaterloo.blogspot.com/2021/01/microsoft-mentorship-program-for-junior.html'
      },
      {
        date: 'Santa Rosa, CA | Jan. 2019 - May 2019',
        name: 'Keysight Technologies',
        description: 'Telemetry Software Development Intern ',
        tools: 'C++',
        link: 'https://www.keysight.com/us/en/home.html'
      },
    ],
    education: [
      {
        date: 'University of Southern California | May 2025',
        name: 'B.S. Computer Science (Games) | B.S. Applied & Computational Mathematics',
        description: 'Viterbi School of Computer Science | School of Cinematic Arts | Dornsife College of Letters Arts & Sciences',
      },
      {
        date: 'Ansan-si, Gyeonggi-do, South Korea | Sep. 2019 - Mar. 2020',
        name: 'Rotary International High School Exchange Student',
        description:
          '양명고등학교 | 경기도 안양시',
      },
      {
        date: 'Healdsburg, CA | Grad. Jun. 2019',
        name: 'Healdsburg High School',
        description: 'Also attended (for a week) Central Catholic in Portland, OR and  (freshman year) Mark Morris High School in Longview, WA'
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
    },/*
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },*/
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 2560,
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