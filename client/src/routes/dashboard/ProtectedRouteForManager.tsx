import { useSession } from '@/hooks/useSession'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const ProtectedRouteForManager = () => {
    const { session } = useSession()
    const navigate = useNavigate()

    useEffect(() => {
        if (!session) {
            navigate('/auth/login', { replace: true })
        } else if (session.user.role !== 'manager') {
            navigate('/', { replace: true })
        }
    }, [session, navigate])

    if (!session || session.user.role !== 'manager') return null

    return <Outlet />
}

export default ProtectedRouteForManager
