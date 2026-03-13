'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export function useAuth() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            const isLoggedIn = localStorage.getItem('isLoggedIn')
            const email = localStorage.getItem('userEmail')
            const name = localStorage.getItem('userName')
            const role = localStorage.getItem('userRole')
            const userId = localStorage.getItem('userId')

            if (!isLoggedIn || !email) {
                setLoading(false)
                return null
            }

            return {
                id: userId || 'unknown',
                email,
                name: name || 'User',
                role: role || 'USER'
            }
        }

        const userData = checkAuth()
        
        if (userData) {
            setUser(userData)
        }
        
        setLoading(false)
    }, [router])

    const refreshAuth = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const email = localStorage.getItem('userEmail')
        const name = localStorage.getItem('userName')
        const role = localStorage.getItem('userRole')
        const userId = localStorage.getItem('userId')

        if (isLoggedIn && email) {
            setUser({
                id: userId || 'unknown',
                email,
                name: name || 'User',
                role: role || 'USER'
            })
        } else {
            setUser(null)
        }
    }

    return { 
        user, 
        loading,
        isAuthenticated: !!user,
        refreshAuth
    }
}

export function signOut() {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    window.location.href = '/auth/login'
}

export function isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true'
}

export function getCurrentUser(): User | null {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const email = localStorage.getItem('userEmail')
    const name = localStorage.getItem('userName')
    const role = localStorage.getItem('userRole')
    const userId = localStorage.getItem('userId')

    if (!isLoggedIn || !email) {
        return null
    }

    return {
        id: userId || 'unknown',
        email,
        name: name || 'User',
        role: role || 'USER'
    }
}
