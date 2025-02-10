import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./component/auth/Layout.jsx";
import Login from "./pages/auth/LoginTutor.jsx";
import Register from "./pages/auth/ParentRegister.jsx";

// Admin
import AdminLayout from "./component/AdminView/Layout.jsx";
import AdminDashboard from "./pages/AdminView/Dashboard.jsx";

// parent
import ParentLayout from "./component/parentView/Layout.jsx";
import ParentDashboard from "./pages/parentView/Dashboard.jsx";


// Tutor
import TutorLayout from "./component/TutorView/Layout.jsx";
import TutorDashboard from "./pages/TutorView/Dashbaord.jsx";



//landing page

import LandingPage from "./pages/LandingPage/LandingPage.jsx";

// Not-found
import NotFound from "./pages/not-found";



import CheckAuth from "./component/Common/CheckAuth.jsx";
import UnauthPage from "./pages/unauth-page";

import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

import CreateUser from "./pages/AdminView/CreateUser.jsx";
import UpdateUser from "./pages/AdminView/UpdateUser.jsx";
import LoginFormCards from "./pages/auth/LoginFormCards.jsx";
import TutorRegistration from "./pages/auth/TutorRegistration.jsx";
import LoginParent from "./pages/auth/LoginParent.jsx";
import SignupFormCards from "./pages/auth/SignupFormCards.jsx";
import AddDocuments from "./pages/TutorView/AddDocuments.jsx";
import TutorDetail from "./pages/parentView/TutorDetail.jsx";
import Messsages from "./pages/TutorView/Messsages.jsx";
import CheckReviews from "./pages/TutorView/CheckReviews.jsx";
import LoginAdmin from "./pages/auth/LoginAdmin.jsx";
import TutorProfileDetail from "./pages/AdminView/TutorProfileDetail.jsx";
import TutorVerfication from "./pages/AdminView/TutorVerfication.jsx";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Routes>
       <Route path="/" element={<Navigate to="/landing" replace />} />
       <Route path="/landing" element={<LandingPage/>}/>
      <Route path="/loginTutor" element={<Login />} />
      <Route path="/loginParent" element={<LoginParent/>}/>
      <Route path="/parent/Register" element={<Register />} />
      <Route path="/logins" element={<LoginFormCards/>}/>
      <Route path="/tutor/Register" element={<TutorRegistration/>}/>
      <Route path="/Signups" element={<SignupFormCards/>}/>
      <Route path="/loginAdmin" element={<LoginAdmin/>}/>
      {/* <Route path="/parent/login" element={<LoginParent/>}/> */}

        <Route 
          path="/admin"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="admin"
            >
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="tutorVerfication" element={<TutorVerfication/>}/>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="tutorProfileDetail/:tutorId" element={<TutorProfileDetail/>}/>
          <Route path="addUser" element={<CreateUser/>}/>
          <Route path="updateUser/:userId" element={<UpdateUser/>}/>
        </Route>

        <Route
          path="/parent"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="parent"
            >
              <ParentLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="tutorDetail/:tutorId" element={<TutorDetail/>}/>
        </Route>

        <Route
          path="/tutor"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="tutor"
            >
              <TutorLayout />
            </CheckAuth>
          }
        >
          
          <Route path="dashboard" element={<TutorDashboard />} />
          <Route path="documents" element={<AddDocuments/>}/>
          <Route path="messages" element={<Messsages/>}/>
          <Route path="reviews" element={<CheckReviews/>}/>
        </Route>

       

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
        {/* Unauthenticated page */}
        <Route path="unauth-page" element={<UnauthPage />} />
      </Routes>
    </>
  );
}

export default App;
