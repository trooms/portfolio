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
          date={post.node.frontmatter.date}
          description={post.node.frontmatter.description}
          tools={post.node.frontmatter.tools}
          link={post.node.fields.slug}
          internal
        />
      ))}
    </Section>
  );
};

export default Projects;