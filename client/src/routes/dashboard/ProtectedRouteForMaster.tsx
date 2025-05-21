import { useSession } from '@/hooks/useSession'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const ProtectedRouteForMaster = () => {
    const { session } = useSession()
    const navigate = useNavigate()

    useEffect(() => {
        if (!session) {
            navigate('/auth/login', { replace: true })
        } else if (session.user.role !== 'master') {
            navigate('/', { replace: true })
        }
    }, [session, navigate])

    if (!session || session.user.role !== 'master') return null

    return <Outlet />
}

export default ProtectedRouteForMaster
