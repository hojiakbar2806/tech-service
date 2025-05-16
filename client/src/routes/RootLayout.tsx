import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const RootLayout = () => {
    return (
        < QueryClientProvider client={queryClient}>
            <Outlet />
            <Toaster />
        </QueryClientProvider>
    )
}

export default RootLayout
