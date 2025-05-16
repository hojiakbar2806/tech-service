import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'

import api from '@/lib/api'
import { navlinks } from '@/lib/const'
import { useSession } from '@/hooks/useSession'
import ProfileNavbar from '@/components/profile-navbar'
import ProfileSidebar from '@/components/profile-sidebar'

const ProfileLayout = () => {
    const { setToken, setUser, token } = useSession()
    const navigate = useNavigate()

    const { mutate, isError, isPending } = useMutation({
        mutationFn: () => api.post("/auth/refresh-token", null, { withCredentials: true }),
        onSuccess: (res) => { setToken(res.data.access_token) },
        onError: () => {
            setToken(null)
            navigate('/auth/login')
        }
    })

    const { isLoading: isLoadingUser } = useQuery({
        enabled: !!token,
        queryKey: ['user'],
        queryFn: () => api.get('/auth/me',
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(res => setUser(res.data)),
    })

    useEffect(() => mutate(), [mutate])

    if (isPending || isLoadingUser|| !token) return null

    if (isError) navigate('/auth/login')

    return (
        <div className='min-h-screen flex flex-col'>
            <ProfileNavbar />
            <div className='flex-1 flex w-full'>
                <ProfileSidebar items={navlinks} />
                <div className='flex-1 flex flex-col w-full p-5'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default ProfileLayout
