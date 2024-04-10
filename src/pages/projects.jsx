import { graphql } from 'gatsby';
import React from 'react';

import Projects from '../components/projects';
import Header from '../components/header';
import Layout from '../components/layout';
import Seo from '../components/seo';
import NotFound from '../pages/404';

const Index = ({ data }) => {
  const projects = data.allMarkdownRemark.edges.filter(
    (edge) => edge.node.frontmatter.type === 'project'
  );
  const noProject = !projects || !projects.length;

  if (!projects || !projects.length) {
    return <NotFound />;
  }

  return (
    <Layout>
      <Seo title="Projects" />
      <Header metadata={data.site.siteMetadata} />
      {!noProject && <Projects projects={projects} />}
    </Layout>
  );
};


export default Index;

export const pageQuery = graphql`
  query Projects {
    site {
      siteMetadata {
        name
        title
        description
        about
        author
        github
        linkedin
      }
    }
    allMarkdownRemark(sort: {frontmatter: {index: DESC}}) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            index
            type
            date
            title
            description
            tools
            image {
              childImageSharp {
                fluid(maxWidth: 600) {
                  ...GatsbyImageSharpFluid
                }
              }
              extension
              publicURL
            }
          }
        }
      }
    }
  }
`;