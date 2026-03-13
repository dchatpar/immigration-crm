'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const email = localStorage.getItem('userEmail')
        const name = localStorage.getItem('userName')
        const role = localStorage.getItem('userRole')

        if (!isLoggedIn || !email) {
            router.push('/auth/login')
            setLoading(false)
            return
        }

        setUser({
            email,
            name,
            role,
            isActive: true
        })
        setLoading(false)
    }, [router])

    return { data: { user }, status: loading ? 'loading' : 'authenticated' }
}

export function signOut() {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    window.location.href = '/auth/login'
}
