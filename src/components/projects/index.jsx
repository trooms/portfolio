import React from 'react';

import Section from '../section';
import SummaryItem from '../summary-item';

const Projects = ({ projects }) => {
  return (
    <Section title="Projects">
      {projects.map((post) => (
        <SummaryItem
          key={post.node.fields.slug}
          name={post.node.frontmatter.title}
          description={post.node.frontmatter.description}
          link={post.node.fields.slug}
          internal
        />
      ))}
    </Section>
  );
};

export default Projects;