import { useEffect, useState, type FC, type ReactNode } from 'react'

import api from '@/lib/api'
import { useSession } from '@/hooks/useSession'
import { useNavigate } from 'react-router'

const SessionProvider: FC<{ children: ReactNode, role: [string] }> = ({ children, role }) => {
    const { session, setSession } = useSession()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        async function fetchSession() {
            setLoading(true)
            const { data } = await api.post('/auth/refresh-token', null, { withCredentials: true })
            const user = await api.get('/auth/me', { headers: { Authorization: `Bearer ${data.access_token}` } })
            setSession({ token: data.access_token, user: user.data })
            setLoading(false)
        }
        if (!session) fetchSession()
        else {
            setLoading(false)
            if (!role.includes(session.user.role)) {
                navigate('/');
            }
        }
    }, [session, setSession, role, navigate])

    if (loading) return null

    return (
        <>{children}</>
    )
}

export default SessionProvider
