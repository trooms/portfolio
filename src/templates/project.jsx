import { graphql } from 'gatsby';
import moment from 'moment';
import React, { useEffect } from 'react';

import Header from '../components/header';
import Layout from '../components/layout';
import Seo from '../components/seo';

const classes = {
  wrapper: 'mt-16 blog-content',
  title: 'mt-16 text-4xl text-gray-900 font-bold',
};

const Project = ({ data }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onload = () => window.initCanvas();
    } else {
      window.initCanvas();
    }
    
  }, []);

  const post = data.markdownRemark;
  return (
    <Layout>
      <Header metadata={data.site.siteMetadata} />
      <Seo title={post.frontmatter.title} />
      <h1 className={classes.title}>{post.frontmatter.title}</h1>
      <div
        className={classes.wrapper}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </Layout>
  );
};


export default Project;

export const pageQuery = graphql`
  query ProjectBySlug($slug: String!) {
    site {
      siteMetadata {
        name
        title
        description
        about
        author
        github
        linkedin
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        type
        title
        date
        tools
        description
      }
    }
  }
`;