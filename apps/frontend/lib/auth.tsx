'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import { setToken } from './apollo'

interface AuthContextValue {
  token: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ token: null, loading: true })

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setLocalToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData

    if (!initData) {
      setLoading(false)
      return
    }

    const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL

    fetch(`${gatewayUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation CreateJwt($initData: String!) {
          createJwt(initData: $initData) {
            accessToken
          }
        }`,
        variables: { initData },
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const accessToken = json?.data?.createJwt?.accessToken
        if (accessToken) {
          setToken(accessToken)
          setLocalToken(accessToken)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return <AuthContext.Provider value={{ token, loading }}>{children}</AuthContext.Provider>
}
