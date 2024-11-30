import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import DiaryForm from "./pages/DiaryForm";
import DiariesPage from "./pages/DiariesPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { authUser } = useAuthContext();

  return (
    <main className="relative flex flex-col items-center min-h-screen w-full overflow-hidden bg-cover bg-center top-0 before:bg-[url('/bg.jpg')] before:bg-cover before:bg-center before:bg-no-repeat before:fixed before:top-0 before:left-0 before:w-full before:h-screen before:-z-10">
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              authUser ? (
                <Navigate to={"/profile"} replace />
              ) : (
                <Navigate to={"/auth/login"} replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              authUser ? <ProfilePage /> : <Navigate to={"/auth/login"} />
            }
          />
          <Route
            path="/diary/log"
            element={authUser ? <DiaryForm /> : <Navigate to={"/auth/login"} />}
          />
          <Route
            path="/diaries"
            element={
              authUser ? <DiariesPage /> : <Navigate to={"/auth/login"} />
            }
          />
          <Route
            path="/auth/signup"
            element={authUser ? <Navigate to={"/diaries"} /> : <Signup />}
          />
          <Route
            path="/auth/login"
            element={authUser ? <Navigate to={"/diaries"} /> : <Login />}
          />
        </Routes>
        <Footer />
      </Router>
      <Toaster />
    </main>
  );
}

export default App;
