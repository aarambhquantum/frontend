import AppRoute from "@atoms/route/Route";
import AdminRoutes from "@components/routes/AdminRoutes";
import PublicRoutes from "@components/routes/PublicRoutes";
import NotFound from "@pages/NotFound";
import { Route, Routes, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  console.log("🚀 ~ App ~ location:", location);

  const checkAuth = () => true;

  return (
    <div>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AppRoute checkAuth={checkAuth} location={location}>
              <AdminRoutes />
            </AppRoute>
          }
        />
        {/* <Route
            path="/user/*"
            element={
              <AppRoute>
                <UserPage />
              </AppRoute>
            }
          /> */}
        <Route
          path="/"
          element={
            <AppRoute checkAuth={checkAuth} location={location}>
              <PublicRoutes />
            </AppRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
