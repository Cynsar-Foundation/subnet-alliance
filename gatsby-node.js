const path = require(`path`);

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allContentfulBlog {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  if (result.errors) {
    throw result.errors;
  }
  result.data.allContentfulBlog.edges.forEach(({ node }) => {
    createPage({
      path: `/blog/${node.slug}`,
      component: path.resolve(
        `./gatsby-theme-landing-page/src/components/blog-post.js`
      ),
      context: {
        slug: node.slug,
      },
    });
  });
};
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type ContentfulLandingPage implements ContentfulReference & ContentfulEntry & Node @dontInfer {
      name: String
      slug: String
      noIndex: Boolean
      title: String
      description: String
      image: ContentfulAsset @link(by: "id", from: "image___NODE")
      sections: [ContentfulLandingPageSection] @link(by: "id", from: "sections___NODE")
    }

    type ContentfulLandingPageSection implements ContentfulReference & ContentfulEntry & Node  @dontInfer {
      name: String
      component: String
      heading: String
      content: [ContentfulLandingPageContent] @link(by: "id", from: "content___NODE")
      secondaryHeading: String
    }

    type ContentfulLandingPageContent implements ContentfulReference & ContentfulEntry & Node @dontInfer {
      name: String
      image: ContentfulAsset @link(by: "id", from: "image___NODE")
      links: [ContentfulLink] @link(by: "id", from: "links___NODE")
      primaryText: contentfulLandingPageContentPrimaryTextTextNode @link(by: "id", from: "primaryText___NODE")
      secondaryText: contentfulLandingPageContentSecondaryTextTextNode @link(by: "id", from: "secondaryText___NODE")
    }

    type ContentfulLink implements ContentfulReference & ContentfulEntry & Node @dontInfer {
      href: String
      text: String
    }
  `;

  createTypes(typeDefs);
};
