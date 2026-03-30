'use client'

import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ApolloProvider } from '@apollo/client/react'

// Module-level token ref — читается authLink при каждом запросе
const tokenRef = { current: '' }

export function setToken(token: string) {
  tokenRef.current = token
}

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    ...(tokenRef.current ? { authorization: `Bearer ${tokenRef.current}` } : {}),
  },
}))

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/graphql`,
})

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          myWorkouts: {
            // Кэшируем отдельно по сортировке, skip/take — для пагинации
            keyArgs: ['pagination', ['sort']],
            merge(existing, incoming) {
              return {
                ...incoming,
                items: [...(existing?.items ?? []), ...incoming.items],
              }
            },
          },
        },
      },
    },
  }),
})

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
