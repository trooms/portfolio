import React from 'react';

import Section from '../section';
import SummaryItem from '../summary-item';

const SectionExperience = ({ experience }) => {
  if (!experience.length) return null;

  return (
    <Section title="Experience">
      {experience.map((item) => (
        <SummaryItem
          key={item.name}
          date={item.date}
          name={item.name}
          description={item.description}
          link={item.link}
          tools={item.tools}
        />
      ))}
    </Section>
  );
};

export default SectionExperience;
