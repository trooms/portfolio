import { Link } from 'gatsby';
import React from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const classes = {
  wrapper: 'mb-6 flex items-center', // Moved display and alignItems here for simplicity
  name: 'font-semibold text-gray-900 pb-1',
  date: 'italic text-gray-600 pb-1',
  description: 'text-md text-gray-600 font-light',
  tools: 'italic text-gray-600 pb-1',
};

const SummaryItem = ({
  date = null,
  name,
  description,
  link = false,
  tools = null,
  internal = false,
  image = null, // Updated prop for image data
}) => {
  let linkContent;
  if (internal) {
    linkContent = <Link to={link}>{name}</Link>;
  } else {
    linkContent = <a href={link} rel="noreferrer">{name}</a>;
  }

  // Extract the image data using getImage helper
  const image = getImage(imageData);

  return (
    <div className={classes.wrapper}>
      {/* Conditionally render GatsbyImage if image is available */}
      {image && <GatsbyImage image={image} alt={name} className="mr-4" />} {/* Adjusted to use GatsbyImage */}
      <div>
        <h3 className={`${classes.name} ${link ? 'hover:underline hover:text-black' : ''}`}>
          {link ? linkContent : name}
        </h3>
        {date && <h3 className={classes.date}>{date}</h3>}
        {tools && <h3 className={classes.tools}>{tools}</h3>}
        <p className={classes.description}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default SummaryItem;
