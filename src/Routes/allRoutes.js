import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";
import TerritoryMapping from "../pages/TerritoryMapping";
import Settings from "../pages/Settings";
import Integrations from "../pages/Integrations";
import Help from "../pages/Help";
import Summary from "../pages/Summary";
import Pipeline from "../pages/Pipeline/index";
import PipelineCoverage from "../pages/PipelineCoverage";
import Efficiency from "../pages/Efficiency/Dashboard";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Summary /> },
  { path: "/index", component: <Summary /> },
  { path: "/territory-mapping", exact: true, component: <TerritoryMapping /> },
  { path: "/settings", exact: true, component: <Settings /> },
  { path: "/integrations", exact: true, component: <Integrations /> },
  { path: "/Help", exact: true, component: <Help /> },
  { path: "/Summary", exact: true, component: <Summary /> },
  { path: "/pipeline", exact: true, component: <Pipeline /> },
  { path: "/pipelinecoverage", exact: true, component: <PipelineCoverage /> },
  { path: "/efficiency", exact: true, component: <Efficiency /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };