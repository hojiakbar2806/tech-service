import ProfileNavbar from '@/components/profile-navbar'
import ProfileSidebar from '@/components/sidebar'
import { Outlet } from 'react-router'
import SessionProvider from '@/components/providers/SessionProvider'

const ProfileLayout = () => {
    return (
        <SessionProvider role={['user']}>
            <div className='h-screen flex flex-col'>
                <ProfileNavbar />
                <div className='flex w-full'>
                    <ProfileSidebar />
                    <div className='h-full overflow-auto flex flex-col w-full px-4 py-5 sm:px-6 lg:px-8'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </SessionProvider>
    )
}

export default ProfileLayout
