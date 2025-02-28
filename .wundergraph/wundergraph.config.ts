import {
  Application,
  configureWunderGraphApplication,
  cors,
  EnvironmentVariable,
  introspect,
  templates,
} from "@wundergraph/sdk";
import server from "./wundergraph.server";
import operations from "./wundergraph.operations";

const music = introspect.graphql({
  apiNamespace: "music",
  url: "https://graphbrainz.herokuapp.com/"
});

const myApplication = new Application({
  name: "app",
  apis: [music],
});


// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  application: myApplication,
  server,
  operations,
  codeGenerators: [
    {
      templates: [
        ...templates.typescript.all,
        templates.typescript.operations,
        templates.typescript.linkBuilder,
      ],
    },
  ],
  cors: {
    ...cors.allowAll,
    allowedOrigins:
      process.env.NODE_ENV === "production"
        ? [
            // change this before deploying to production to the actual domain where you're deploying your app
            "http://localhost:3000",
          ]
        : [
            "http://localhost:3000",
            new EnvironmentVariable("WG_ALLOWED_ORIGIN"),
          ],
  },
  dotGraphQLConfig: {
    hasDotWunderGraphDirectory: false,
  },
});
