import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import SummaryItem from '../components/summary-item';

import React from 'react';
import { graphql } from 'gatsby';
import SummaryItem from '../components/summary-item';

// Assuming the GraphQL query is already updated and included above

const IndexPage = ({ data }) => {
  const projects = data.allMarkdownRemark.edges;

  return (
    <div>
      {projects.map(({ node }) => (
        <SummaryItem
          key={node.fields.slug}
          name={node.frontmatter.title}
          date={node.frontmatter.date}
          description={node.frontmatter.description}
          tools={node.frontmatter.tools}
          link={node.fields.slug}
          image={node.frontmatter.image} // Pass the image data to SummaryItem
        />
      ))}
    </div>
  );
};

export default IndexPage;
