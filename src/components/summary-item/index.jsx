import { Link } from 'gatsby';
import React from 'react';

const classes = {
  wrapper: 'mb-6',
  name: 'font-semibold text-gray-900 pb-1',
  date: 'italic text-gray-600 pb-1',
  description: 'text-md text-gray-600 font-light',
  tools: 'italic text-gray-600 pb-1',
};

import React from 'react';
import { Link } from 'gatsby';

const classes = {
  wrapper: 'mb-6',
  name: 'font-semibold text-gray-900 pb-1',
  date: 'italic text-gray-600 pb-1',
  description: 'text-md text-gray-600 font-light',
  tools: 'italic text-gray-600 pb-1',
  image: 'max-w-xs w-full', // Adjust size as needed
};

const SummaryItem = ({
  date = null,
  name,
  description,
  link = false,
  tools = null,
  internal = false,
  image = null, // New image parameter
}) => {
  let linkContent;
  if (internal) {
    linkContent = <Link to={link}>{name}</Link>;
  } else {
    linkContent = <a href={link} rel="noreferrer">{name}</a>;
  }

  return (
    <div className={classes.wrapper}>
      {image && <img src={image} alt={name} className={classes.image} />} {/* Display the image */}
      <h3
        className={`${classes.name} ${
          link ? 'hover:underline hover:text-black' : ''
        }`}
      >
        {link ? linkContent : name}
      </h3>
      {date && <h3 className={classes.date}>{date}</h3>}
      {tools && <h3 className={classes.tools}>{tools}</h3>}
      <p 
        className={classes.description}
        style={{
            wordWrap: 'break-word', /* IE>=5.5 */
            whiteSpace: 'pre', /* IE>=6 */
            whiteSpace: '-moz-pre-wrap', /* For Fx<=2 */
            whiteSpace: 'pre-wrap' /* Fx>3, Opera>8, Safari>3*/
        }}>
        {description}
    </p>
    </div>
  );
};

export default SummaryItem;
