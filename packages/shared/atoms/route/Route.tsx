import React from "react";
import { Navigate } from "react-router-dom";

interface RouteProps {
  children: React.ReactNode;
  checkAuth: () => boolean;
  location: unknown;
}

const Route = ({ children, checkAuth, location }: RouteProps) => {
  return checkAuth() ? (
    <>{children}</>
  ) : (
    <Navigate to={`/login`} state={{ from: location }} />
  );
};

export default Route;
