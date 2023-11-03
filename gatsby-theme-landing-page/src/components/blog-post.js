// src/templates/blog-post.js
import React from "react";
import { graphql } from "gatsby";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Layout from "../../../src/components/layout";
import * as styles from "./blog.module.css";

const BlogPostTemplate = ({ data }) => {
  const post = data.contentfulBlog;

  if (!post) {
    console.error("No post found!");
    return null;
  }

  const options = {
    renderNode: {
      "embedded-asset-block": (node) => (
        <img
          src={node.data.target.fields.file.url}
          alt={node.data.target.fields.description}
        />
      ),
      "ordered-list-item": (node) => (
        <ol>
          {node.content.map((item, index) => (
            <li key={index}>{documentToReactComponents(item)}</li>
          ))}
        </ol>
      ),
      "unordered-list-item": (node) => (
        <ul>
          {node.content.map((item, index) => (
            <li key={index}>{documentToReactComponents(item)}</li>
          ))}
        </ul>
      ),
      paragraph: (node) => (
        <p>{node.content.map((item) => item.value).join("")}</p>
      ),
    },
  };

  const content = post.content.raw;
  return (
    <Layout>
      <div className={styles.blogPost}>
        <div className={styles.blogPostContent}>
          <h1>{post.title}</h1>
          <p>{post.published}</p>
          <div>{documentToReactComponents(JSON.parse(content, options))}</div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPostTemplate;

export const query = graphql`
  query ($slug: String!) {
    contentfulBlog(slug: { eq: $slug }) {
      title
      published
      content {
        raw
      }
    }
  }
`;
