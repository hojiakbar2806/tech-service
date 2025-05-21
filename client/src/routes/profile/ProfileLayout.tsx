import { navlinks } from '@/lib/const'
import ProfileNavbar from '@/components/profile-navbar'
import ProfileSidebar from '@/components/sidebar'
import { Outlet } from 'react-router'
import SessionProvider from '@/components/providers/SessionProvider'

const ProfileLayout = () => {
    return (
        <SessionProvider role={['user']}>
            <div className='min-h-screen flex flex-col'>
                <ProfileNavbar />
                <div className='flex-1 flex w-full'>
                    <ProfileSidebar items={navlinks["user"]} />
                    <div className='flex-1 flex flex-col w-full p-5'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </SessionProvider>
    )
}

export default ProfileLayout
