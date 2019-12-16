const { ApolloServer, gql } = require('apollo-server');
let casual = require('casual');

const typeDefs = gql`
  type Query {
    page(pubId: String): Page
    pages(pubId: String): [Page]
  }

  type Page {
    itemId: String
    title: String
    containerItems: [ContainerItem]
  }

  type ContainerItem {
    itemId: String
    component: Component
    componentTemplate: ComponentTemplate
    rawContent: RawContent
  }

  type Component {
    itemId: String
    schemaId: String
    title: String
    multiMedia: Boolean
    lastPublishDate: String
    creationDate: String
    updatedDate: String
    initialPublishDate: String
  }

  type RawContent {
    data: Data
    metadata: Metadata
  }

  type Data {
    content: Content
  }

  type Content {
    headline: String
    intro: String
    articleBody: ArticleBody
  }

  type ArticleBody {
    content: ArticleContent
  }

  type ArticleContent {
    Fragments: [String]
  }

  type Metadata {
    standardMeta: StandardMeta
  }

  type StandardMeta {
    name: String
    description: String
  }

  type ComponentTemplate {
    itemId: String
    title: String
  }
`;

const resolvers = {
  Query: {
    //fragments: () => `<p>${casual.sentence}</p>`,
  },
};

const html = function() {
  let result = [];
  let numItems = Math.floor(Math.random() * 5) + 1;

	for (let i = 0; i < numItems; ++i) {
    let isList = Math.floor(Math.random() * 3) + 1 === 1;
    let fragment = '';

    if (isList) {
      let numListItems = Math.floor(Math.random() * 5) + 1;

      for (let l = 0; l < numListItems; ++l) {
        fragment = `${fragment}<li>${casual.sentence}</li>`;
      }

      fragment = `<ul>${fragment}</ul>`;
    } else {
      fragment = `<p>${casual.sentence}</p>`;
    }
    result.push(fragment);
  }

  return result;
};

const mocks = {
  Page: (parent, args) => ({
    itemId: casual.uuid,
    title: `${args.pubId ? args.pubId + ' - ' : ''}${casual.title}`
  }),
  ContainerItem: () => ({
    itemId: casual.uuid
  }),
  Component: () => ({
    itemId: casual.uuid,
    schemaId: casual.uuid,
    title: casual.title,
    multiMedia: casual.boolean,
    lastPublishDate: casual.date("YYYY-MM-DDTHH:mm:ss+01:00"),
    creationDate: casual.date("YYYY-MM-DDTHH:mm:ss+01:00"),
    updatedDate: casual.date("YYYY-MM-DDTHH:mm:ss+01:00"),
    initialPublishDate: casual.date("YYYY-MM-DDTHH:mm:ss+01:00"),
  }),
  ComponentTemplate: () => ({
    itemId: casual.uuid,
    title: casual.random_element(['banner','article','accordion'])
  }),
  RawContent: () => ({
    data: {
      content: {
        headline: casual.title,
        intro: casual.sentence,
        articleBody: {
          content: {
            Fragments: html()
          }
        }
      }
    },
    metadata: {
      standardMeta: {
        name: casual.title,
        description: casual.sentence
      }
    }
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});