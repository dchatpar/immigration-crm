'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseApiOptions<T> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: object
  immediate?: boolean
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(options: UseApiOptions<T>) {
  const { url, method = 'GET', body, immediate = true } = options
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  const execute = useCallback(async (overrideBody?: object) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body || overrideBody ? JSON.stringify(body || overrideBody) : undefined,
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Request failed')
      }
      
      setState({ data: data.data, loading: false, error: null })
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, loading: false, error: message }))
      throw error
    }
  }, [url, method, body])

  useEffect(() => {
    if (immediate && (method === 'GET' || !body)) {
      execute()
    }
  }, [execute, immediate, method, body])

  return {
    ...state,
    execute,
    refetch: () => execute(),
  }
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
