import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routes/Home";
import SendRequest from "./routes/profile/SendRequest";
import ApplicationsPage from "./routes/profile/Application";
import ProfileLayout from "./routes/profile/ProfileLayout";
import VerifyToken from "./routes/auth/VerifyToken";
import RootLayout from "./routes/RootLayout";
import LoginPage from "./routes/auth/Login";
import DashboardLayout from "./routes/dashboard/DashboardLayout";
import Dashboard from "./routes/dashboard/manager/Dashboard";
import Applications from "./routes/dashboard/master/Applications";
import ManagerApplications from "./routes/dashboard/manager/Applications.tsx";
import ProtectedRouteForMaster from "./routes/dashboard/ProtectedRouteForMaster";
import ProtectedRouteForManager from "./routes/dashboard/ProtectedRouteForManager.tsx"; // agar kerak bo‘lsa
import NotificationsPage from "./routes/Notifications";
import SettingsPage from "./routes/Settings.tsx";
import UsersPage from "./routes/dashboard/manager/Users.tsx";
import ComponentsPage from "./routes/dashboard/master/Components.tsx";
import RegisterPage from "./routes/auth/Register.tsx";

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
          {
            path: "register",
            Component: RegisterPage,
          },
        ],
      },
      {
        path: "profile",
        Component: ProfileLayout,
        children: [
          {
            index: true,
            Component: SettingsPage,
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
                Component: SettingsPage, 
              },
              {
                path: "applications",
                Component: Applications,
              },
              {
                path:"notifications",
                Component: NotificationsPage
              },
              {
                path:"settings",
                Component: SettingsPage
              },
              {
                path:"components",
                Component: ComponentsPage
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
                path: "users",
                Component: UsersPage,
              },
              {
                path: "applications",
                Component: ManagerApplications,
              },
              {
                path:"notifications",
                Component: NotificationsPage
              },
              {
                path:"settings",
                Component: SettingsPage
              }
            ],
          },
        ],
      },
    ],
  },
]);
