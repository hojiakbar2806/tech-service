import { useEffect, useState, type FC, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import api from '@/lib/api';
import { useSession } from '@/hooks/useSession';

const SessionProvider: FC<{ children: ReactNode, role: string[] }> = ({ children, role }) => {
    const { session, setSession } = useSession();
    const navigate = useNavigate();
    const location = useLocation();
    const roleParams = new URLSearchParams(window.location.search).get('role');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        async function fetchSession() {
            setLoading(true);
            try {
                const { data } = await api.post('/auth/refresh-token', null, { withCredentials: true });
                const user = await api.get('/auth/me', { headers: { Authorization: `Bearer ${data.access_token}` } });
                setSession({ token: data.access_token, user: user.data });
            } catch {
                navigate(`/auth/login${roleParams ? "?role=" + roleParams : ""}`);
            } finally {
                setLoading(false);
            }
        }

        if (!session) {
            fetchSession();
        } else if (role.includes(session.user.role)) {
            if (location.pathname === "/dashboard/" || location.pathname === "/dashboard") {
                navigate(`/dashboard/${session.user.role}`);
            }
        }
    }, [session, setSession, role, navigate, roleParams, location.pathname]);

    if (loading) return null;

    return <>{children}</>;
};

export default SessionProvider;