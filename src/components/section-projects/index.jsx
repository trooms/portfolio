import React from 'react';

import Section from '../section';
import SummaryItem from '../summary-item';

const SectionProjects = ({ projects }) => {
  if (!projects.length) return null;

  return (
    <Section title="Projects">
      {projects.map((project) => (
        <SummaryItem
          key={project.node.fields.slug}
          date={project.node.frontmatter.date}
          name={project.node.frontmatter.title}
          description={project.node.frontmatter.description}
          tools={post.node.frontmatter.tools}
          link={project.node.fields.slug}
          internal
        />
      ))}
    </Section>
  );
};

export default SectionProjects;
