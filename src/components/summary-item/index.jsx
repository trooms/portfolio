import { Link } from 'gatsby';
import React from 'react';
import Img from 'gatsby-image'; // or { GatsbyImage } from 'gatsby-plugin-image' for newer versions

const SummaryItem = ({
  date = null,
  name,
  description,
  link = false,
  tools = null,
  internal = false,
  imageData = null, // New prop for image data
}) => {
  let linkContent;
  if (internal) {
    linkContent = <Link to={link}>{name}</Link>;
  } else {
    linkContent = <a href={link} rel="noreferrer">{name}</a>;
  }

  return (
    <div className={classes.wrapper} style={{ display: 'flex', alignItems: 'center' }}> {/* Adjust style for layout */}
      {imageData && <Img fluid={imageData.childImageSharp.fluid} alt={name} />} {/* Display the image */}
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
