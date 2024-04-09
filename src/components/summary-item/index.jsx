import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';

const classes = {
  // class definitions remain unchanged
};

const SummaryItem = ({
  date = null,
  name,
  description,
  link = false,
  tools = null,
  internal = false,
  image = null,
}) => {
  let linkContent;
  if (internal) {
    linkContent = <Link to={link}>{name}</Link>;
  } else {
    linkContent = <a href={link} rel="noreferrer">{name}</a>;
  }

  return (
    <div className={classes.wrapper}>
      {image && <Img fluid={image.childImageSharp.fluid} alt={name} className={classes.image} />}
      <h3 className={`${classes.name} ${link ? 'hover:underline hover:text-black' : ''}`}>{
        {link ? linkContent : name}
      }</h3>
      {date && <h3 className={classes.date}>{date}</h3>}
      {tools && <h3 className={classes.tools}>{tools}</h3>}
      <p className={classes.description}>{description}</p>
    </div>
  );
};

export default SummaryItem;
