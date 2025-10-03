import type {CodegenConfig} from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/api/graphql",
  documents: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "graphql/**/*.{ts,tsx}",
  ],
  generates: {
    "./graphql/generated/": {
      preset: "client",
      config: {
        scalars: {
          DateTime: "string",
        },
        useTypeImports: true,
        strictScalars: true,
        enumsAsTypes: true,
        immutableTypes: true,
      },
    },
  },
  config: {
    skipTypename: false,
  },
};

export default config;
