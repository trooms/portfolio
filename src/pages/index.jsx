import { graphql } from 'gatsby';
import get from 'lodash/get';
import React from 'react';

import Header from '../components/header';
import Layout from '../components/layout';
import SectionAbout from '../components/section-about';
import Seo from '../components/seo';
import SectionUpdates from '../components/section-updates';

const Index = ({ data }) => {
  const about = get(data, 'site.siteMetadata.extendedAbout', false);
  const education = get(data, 'site.siteMetadata.education', false);
  const projects = get(data, 'site.siteMetadata.skills', false);
  const experience = get(data, 'site.siteMetadata.experience', false);

  return (
    <Layout>
      <Seo title={'Home'} />
      <Header metadata={data.site.siteMetadata} />
      {about && <SectionAbout about={about} />}
      {education && education.length && (
        <SectionEducation education={education} />
      )}
      {projects && projects.length && (
        <SectionProjects projects={projects} />
      )}
      {experience && experience.length && (
        <SectionExperience experience={experience} />
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
        projects {
          date
          name
          description
        }
        experience {
          date
          name
          description
        }
        education {
          date
          name
          description
        }
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 5) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            type
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;