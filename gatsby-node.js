const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const projectTemplate = path.resolve(`./src/templates/project.jsx`);
  const blogPostTemplate = path.resolve(`./src/templates/blog-post.jsx`);
  const result = await graphql(`
    {
      allMarkdownRemark(sort: {frontmatter: {index: DESC}}, limit: 1000) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              type
              title
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  const projects = result.data.allMarkdownRemark.edges.filter(
    (edge) => edge.node.frontmatter.type === 'project'
  );
  const posts = result.data.allMarkdownRemark.edges.filter(
    (edge) => edge.node.frontmatter.type === 'blog'
  );

  projects.forEach((project, index) => {
    const previous =
      index === projects.length - 1 ? null : projects[index + 1].node;
    const next = index === 0 ? null : projects[index - 1].node;

    createPage({
      path: project.node.fields.slug,
      component: projectTemplate,
      context: {
        slug: project.node.fields.slug,
        previous,
        next,
      },
    });
  });

  // Create projects pages.

  projects.forEach((project, index) => {
    const previous =
      index === projects.length - 1 ? null : projects[index + 1].node;
    const next = index === 0 ? null : projects[index - 1].node;

    createPage({
      path: project.node.fields.slug,
      component: projectTemplate,
      context: {
        slug: project.node.fields.slug,
        previous,
        next,
      },
    });
  });


  // Create project posts pages.

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    createPage({
      path: post.node.fields.slug,
      component: blogPostTemplate,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    const slugPrefix = node.frontmatter.type === 'blog' ? '/blog' : '/projects';
    createNodeField({
      name: `slug`,
      node,
      value: `${slugPrefix}${value}`,
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type SiteSiteMetadata {
      siteUrl: String
      name: String
      title: String
      description: String
      author: String
      github: String
      linkedin: String
      about: String
      projects: [SectionItem]
      experience: [SectionItem]
      skills: [SectionItem]
      date: String
      tools: String
    }

    type SectionItem {
      name: String!
      date: String
      description: String!
      tools: String
      link: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      index: ID!
      type: String
      title: String
      description: String
      date: String
      tools: String
      image: File @link(by: "relativePath")
    }
    
    type Fields {
      slug: String
    }
  `;
  createTypes(typeDefs);
};