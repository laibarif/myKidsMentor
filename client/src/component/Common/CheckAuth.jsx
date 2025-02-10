import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
 console.log(location.pathname)
  if (!isAuthenticated && location.pathname === "/") {
    return <Navigate to="/landing" />;
  }
  
  if (isAuthenticated === undefined || user === undefined) {
    return <div>Loading...</div>; 
  }


  if (!isAuthenticated && (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/landing" || location.pathname === "/loginAdmin")) {
    return <>{children}</>;
  }
  
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register") ||
      location.pathname.includes("/landing")
    )
  ) {
    return <Navigate to="/landing" />;
  }


  if (
    (isAuthenticated && location.pathname.includes("/login")) ||
    location.pathname.includes("/register") || location.pathname.includes("/landing") || location.pathname.includes("/loginAdmin")
  ) {
    if (user?.role === "Admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user?.role === "tutor") {
      return <Navigate to="/tutor/dashboard" />;
    } else if (user?.role === "parent") {
      return <Navigate to="/parent/dashboard" />;
    }
  }


  
  if (isAuthenticated && location.pathname === "/") {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user?.role === "tutor") {
      return <Navigate to="/tutor/dashboard" />;
    } else if (user?.role === "parent") {
      return <Navigate to="/parent/dashboard" />;
    }
  }

  // if (
  //   isAuthenticated &&
  //   ((user?.role === "admin" &&
  //     (location.pathname.includes("/shop") ||
  //       location.pathname.includes("/user") ||
  //       location.pathname.includes("/shopowner") ||
  //       location.pathname.includes("/customer"))) ||
  //     (user?.role === "shopowner" &&
  //       (location.pathname.includes("/admin") ||
  //         location.pathname.includes("/user") ||
  //         location.pathname.includes("/customer"))) ||
  //     (user?.role === "customer" &&
  //       (location.pathname.includes("/admin") ||
  //         location.pathname.includes("/user") ||
  //         location.pathname.includes("/shopowner"))) ||
  //     (user?.role === "user" &&
  //       (location.pathname.includes("/admin") ||
  //         location.pathname.includes("/shopowner") ||
  //         location.pathname.includes("/customer"))))
  // ) {
  //   return <Navigate to={`/${user?.role}/dashboard`} />;
  // }

  return <>{children}</>;
}

export default CheckAuth;
