'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

import { setToken } from './apollo'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

interface TelegramContextType {
  telegramUser: TelegramUser | null
  initData: string | null
  token: string | null
  loading: boolean
  error: string | null
}

const TelegramContext = createContext<TelegramContextType>({
  telegramUser: null,
  initData: null,
  token: null,
  loading: true,
  error: null,
})

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [initData, setInitData] = useState<string | null>(null)
  const [token, setLocalToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let initDataString: string | null = null

    if (window.Telegram?.WebApp?.initData) {
      initDataString = window.Telegram.WebApp.initData
    } else {
      const hash = window.location.hash.slice(1)
      const params = new URLSearchParams(hash)
      initDataString = params.get('tgWebAppData')
    }

    if (!initDataString) {
      setLoading(false)
      return
    }

    setInitData(initDataString)

    // Парсим user из initData
    try {
      const params = new URLSearchParams(initDataString)
      const userParam = params.get('user')
      if (userParam) {
        const user = JSON.parse(decodeURIComponent(userParam)) as TelegramUser
        setTelegramUser(user)
      }
    } catch (error) {
      console.error('Failed to parse user data from initData:', error)
    }

    // Auth — получаем JWT
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
        variables: { initData: initDataString },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`)
        }
        return res.json()
      })
      .then((json) => {
        if (json.errors) {
          setError(JSON.stringify(json.errors))
          return
        }
        const accessToken = json?.data?.createJwt?.accessToken
        if (accessToken) {
          setToken(accessToken)
          setLocalToken(accessToken)
        } else {
          setError('No accessToken in response: ' + JSON.stringify(json))
        }
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <TelegramContext.Provider value={{ telegramUser, initData, token, loading, error }}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram(): TelegramContextType {
  return useContext(TelegramContext)
}
