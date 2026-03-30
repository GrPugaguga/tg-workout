import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  documents: 'libs/contracts/src/graphql/**/*.graphql',
  generates: {
    'apps/frontend/generated/': {
      preset: 'client',
    },
  },
}

export default config
