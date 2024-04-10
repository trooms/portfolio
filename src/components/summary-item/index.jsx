import { Link } from 'gatsby';
import React from 'react';
import Img from 'gatsby-image';

const classes = {
  wrapper: 'mb-6',
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
  image = null
}) => {
  let linkContent;
  if (internal) {
    linkContent = <Link to={link}>{name}</Link>;
  } else {
    linkContent = <a href={link} rel="noreferrer">{name}</a>;
  }

  return (
    <div className={classes.wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className={classes.textContent} style={{ flex: 1, marginRight: '20px'}}>
      <h3 className={`${classes.name} ${link ? 'hover:underline hover:text-black' : ''}`}>
        {link ? linkContent : name}
      </h3>
      {date && <h3 className={classes.date}>{date}</h3>}
      {tools && <h3 className={classes.tools}>{tools}</h3>}
      <p className={classes.description} style={{
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
      }}>
        {description}
      </p>
    </div>
    {image && <div style={{ width: '1px', backgroundColor: '#e5e7eb', height: 'auto', alignSelf: 'stretch' }}></div>}
    {(image && image.childImageSharp) && <div className={classes.imageColumn} style={{ flex: 1, marginLeft: '40px'}}><Img fluid={image.childImageSharp.fluid} alt={name} /></div>}
    { !image.childImageSharp && image.extension === 'gif' && <div className={classes.imageColumn} style={{ flex: 1, marginLeft: '40px'}}><img src={image.publicURL} alt={name} /></div>}
  </div>
  );
};

export default SummaryItem;