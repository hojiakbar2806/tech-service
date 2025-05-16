import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routes/Home";
import SendRequest from "./routes/profile/SendRequest";
import Profile from "./routes/profile/Profile";
import ApplicationsPage from "./routes/profile/Application";
import ProfileLayout from "./routes/profile/ProfileLayout";
import VerifyToken from "./routes/auth/VerifyToken";
import RootLayout from "./routes/RootLayout";
import LoginPage from "./routes/auth/Login";
import NotificationsPage from "./routes/profile/Notifications";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children:[
            {
                index: true,
                Component: HomePage,
            },
            {
                path:"auth",
                children: [
                    {
                        path:"verify/:token",
                        Component: VerifyToken
                    },
                    {
                        path:"login",
                        Component: LoginPage
                    }
                ]
            },
            {
                path:"profile",
                Component: ProfileLayout,
                children: [
                    {
                        index: true,
                        Component: Profile,
                    },
                    {
                        path: "applications",
                        Component: ApplicationsPage,
                    },
                    {
                        path: "send-request",
                        Component: SendRequest,
                    },
                    {
                        path: "notifications",
                        Component:NotificationsPage
                    }
                ]
            }
        ]
    }
]);
