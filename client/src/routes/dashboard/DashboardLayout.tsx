import React from 'react';
import ProfileNavbar from '@/components/profile-navbar';
import DashboardSidebar from '@/components/sidebar';
import { Outlet } from 'react-router';
import SessionProvider from '@/components/providers/SessionProvider';

const DashboardLayout: React.FC = () => {
    return (
        <SessionProvider role={["master", "manager"]}>
            <div className="h-screen flex flex-col">
                <ProfileNavbar />
                <div className="flex w-full h-[calc(100%-80px)]">
                    <DashboardSidebar />
                    <div className="w-full md:w-[calc(100%-280px)] flex flex-col p-5 overflow-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </SessionProvider>
    );
};

export default DashboardLayout;
