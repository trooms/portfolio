import { graphql } from 'gatsby';
import get from 'lodash/get';
import React from 'react';

import Header from '../components/header';
import Layout from '../components/layout';
import SectionAbout from '../components/section-about';
import SectionProjects from '../components/section-projects';
import SectionEducation from '../components/section-education';
import SectionExperience from '../components/section-experience';

import Seo from '../components/seo';

const Index = ({ data }) => {
  const about = get(data, 'site.siteMetadata.about', false);
  const education = get(data, 'site.siteMetadata.education', false);
  const projects = data.allMarkdownRemark.edges;
  const experience = get(data, 'site.siteMetadata.experience', false);

  return (
    <Layout>
      <Seo title={'Home'} />
      <Header metadata={data.site.siteMetadata} />
      {about && <SectionAbout about={about} />}
      {projects && projects.length && (
        <SectionProjects projects={projects} />
      )}
      {experience && experience.length && (
        <SectionExperience experience={experience} />
      )}
      {education && education.length && (
        <SectionEducation education={education} />
      )}
    </Layout>
  );
};

export default Index;

export const pageQuery = graphql`
  query pageUserstalhaDesktopGitHubtalhayranciComsrcpagesindexJsx1345041852 {
    site {
      siteMetadata {
        name
        title
        description
        about
        author
        github
        linkedin
        experience {
          date
          name
          description
          tools
          link
        }
        education {
          date
          name
          description
        }
      }
    }
    allMarkdownRemark(sort: { frontmatter: { index: DESC } }, limit: 5) {
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
            tools
            description
          }
        }
      }
    }
  }
`;