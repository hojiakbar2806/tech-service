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
import DashboardLayout from "./routes/dashboard/DashboardLayout";
import Dashboard from "./routes/dashboard/manager/Dashboard";
import UsersList from "./routes/dashboard/manager/UsersList";
import Applications from "./routes/dashboard/manager/RecentlyApplications";
import AllApplications from "./routes/dashboard/manager/AllApplications";
import AddUser from "./routes/dashboard/manager/AddUser";
import ProtectedRouteForMaster from "./routes/dashboard/ProtectedRouteForMaster";
import ProtectedRouteForManager from "./routes/dashboard/ProtectedRouteForManager.tsx"; // agar kerak bo‘lsa
import CompletedApplications from "./routes/dashboard/master/CompletedApplications.tsx";
import NewApplications from "./routes/dashboard/master/NewApplications.tsx";
import ReceivedApplications from "./routes/dashboard/master/ReceivedApplications.tsx";
import NotificationsForMaster from "./routes/dashboard/master/Notifications.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "auth",
        children: [
          {
            path: "verify/:token",
            Component: VerifyToken,
          },
          {
            path: "login",
            Component: LoginPage,
          },
        ],
      },
      {
        path: "profile",
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
            Component: NotificationsPage,
          },
        ],
      },
      {
        path: "dashboard",
        Component: DashboardLayout,
        children: [
          {
            path: "master",
            Component: ProtectedRouteForMaster,
            children: [
              {
                index: true,
                Component: Applications, 
              },
              {
                path: "new-applications",
                Component: NewApplications,
              },
              {
                path: "received-applications",
                Component: ReceivedApplications,
              },
              {
                path:"completed-applications",
                Component: CompletedApplications
              },
              {
                path:"notifications",
                Component: NotificationsForMaster
              }
            ],
          },
          {
            path: "manager",
            Component: ProtectedRouteForManager,
            children: [
              {
                index: true,
                Component: Dashboard,
              },
              {
                path: "users-list",
                Component: UsersList,
              },
              {
                path: "users-add",
                Component: AddUser,
              },
              {
                path: "recently-applications",
                Component: Applications,
              },
              {
                path: "all-applications",
                Component: AllApplications,
              },
              {
                path:"notifications",
                Component: NotificationsForMaster
              }
            ],
          },
        ],
      },
    ],
  },
]);
