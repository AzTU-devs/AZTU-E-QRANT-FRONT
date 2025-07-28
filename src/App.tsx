import { useEffect } from "react";
import Home from "./pages/Dashboard/Home";
import AppLayout from "./layout/AppLayout";
import Intro from "./components/intro/Intro";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import { useNavigate } from "react-router-dom";
import UserProfiles from "./pages/UserProfiles";
import NotFound from "./pages/OtherPage/NotFound";
import Experts from "./components/experts/Experts";
import { Provider, useSelector } from "react-redux";
import SetExpert from "./components/setExpert/SetExpert";
import NewExpert from "./components/newExpert/NewExpert";
import UserViewPage from "./pages/UserView/UserViewPage";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState, store, persistor } from "./redux/store";
import MainSmetaPage from "./pages/MainSmeta/MainSmetaPage";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { PersistGate } from "redux-persist/integration/react";
import SmetaToolsPage from "./pages/SmetaTools/SmetaToolsPage";
import SmetaOtherPage from "./pages/SmetaOther/SmetaOtherPage";
import MyProjectPage from "./pages/MyProjectPage/MyProjectPage";
import UserDetailsPage from "./pages/UserDetails/UserDetailsPage";
import SmetaSalaryPage from "./pages/SmetaSalary/SmetaSalaryPage";
import ProjectViewPage from "./pages/ProjectView/ProjectViewPage";
import ProjectTablePage from "./pages/ProjectTable/ProjectTablePage";
import UserTypeChoicePage from "./pages/AuthPages/UserTypeChoicePage";
import CollaboratorPage from "./pages/Collaborators/CollaboratorPage";
import SmetaServicesPage from "./pages/SmetaServices/SmetaServicesPage";
import SmetaExpensesPage from "./pages/SmetaExpenses/SmetaExpensesPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage/ProjectDetailsPage";
import ApproveWaitingCollaboratorsPage from "./pages/ApproveWaitingCollaboratorsPage/ApproveWaitingCollaboratorsPage";
import CollboratorProject from "./components/collaboratorProject/CollboratorProject";

export default function App() {
  return (
    <Router>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppWithRouterWrapper />
        </PersistGate>
      </Provider>
    </Router>
  );
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

function AppWithRouterWrapper() {
  const token = useSelector((state: RootState) => state.auth.token);
  const userType = useSelector((state: RootState) => state.auth.userType);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      navigate("/signin");
    }
  }, [token, navigate]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route index path="/" element={<Intro />} />
        {token && !isTokenExpired(token) ? (
          <Route element={<AppLayout />}>
            <Route index path="/home" element={<Home />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/project-offer" element={<ProjectDetailsPage />} />
            <Route path="/user-details/:fin_kod" element={<UserDetailsPage />} />
            <Route path="/projects" element={<ProjectTablePage />} />
            <Route path="/collaborators" element={<CollaboratorPage />} />
            <Route path="/main-smeta" element={<MainSmetaPage />} />
            <Route path="/project-smeta-salary" element={<SmetaSalaryPage />} />
            <Route path="/project-smeta-tools" element={<SmetaToolsPage />} />
            <Route path="/project-smeta-services" element={<SmetaServicesPage />} />
            <Route path="/project-smeta-expences" element={<SmetaExpensesPage />} />
            <Route path="/project-smeta-other-expences" element={<SmetaOtherPage />} />
            <Route path="/project-view/:projectCode" element={<ProjectViewPage />} />
            <Route path="/user-view/:fin_kod" element={<UserViewPage />} />
            <Route path="/my-project" element={<MyProjectPage />} />
            <Route path="/approve-waiting-users" element={<ApproveWaitingCollaboratorsPage />} />
            <Route path="/set-expert" element={<SetExpert />} />
            <Route path="/new-expert" element={<NewExpert />} />
            <Route path="/experts" element={<Experts />} />
            <Route path="/collaborator-project" element={<CollboratorProject />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/signin" />} />
        )}

        <Route
          path="/signin"
          element={
            userType === null ? (
              <UserTypeChoicePage />
            )
              // : academicType === null ? (
              //   <AcademicTypeChoicePage />
              // )
              : (
                <SignIn />
              )
          }
        />
        <Route
          path="/signup"
          element={
            userType === null ? (
              <UserTypeChoicePage />
            )
              // : academicType === null ? (
              //   <AcademicTypeChoicePage />
              // )
              : (
                <SignUp />
              )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}