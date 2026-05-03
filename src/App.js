import { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowItWorks";
import Login from "./components/Login";
import Register from "./components/Register";
import EditProfile from "./components/EditProfile";
import RestaurantDashboard from "./components/RestaurantDashboard";
import NGODashboard from "./components/NGODashboard";
import { deleteAccount } from "./services/authService";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  // Scroll to top on every page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const nav = (p) => setPage(p);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    nav(loggedInUser.role === "restaurant" ? "restaurant" : "ngo");
  };

  const handleLogout = () => {
    setUser(null);
    nav("home");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Delete your account permanently? This cannot be undone.")) {
      deleteAccount(user.userId);
      setUser(null);
      nav("home");
    }
  };

  return (
    <>
      <Header
        user={user}
        currentPage={page}
        onNav={nav}
        onLogout={handleLogout}
      />

      {page === "home"         && <Home onRegister={() => nav("register")} />}
      {page === "about"        && <AboutUs />}
      {page === "how-it-works" && <HowItWorks />}

      {page === "login" && (
        <Login onLogin={handleLogin} onGoRegister={() => nav("register")} />
      )}
      {page === "register" && (
        <Register onGoLogin={() => nav("login")} />
      )}

      {page === "edit" && user && (
        <EditProfile
          user={user}
          setUser={setUser}
          onBack={() => nav(user.role === "restaurant" ? "restaurant" : "ngo")}
        />
      )}

      {page === "restaurant" && user && (
        <RestaurantDashboard
          user={user}
          onEdit={() => nav("edit")}
          onDeleteAccount={handleDeleteAccount}
        />
      )}

      {page === "ngo" && user && (
        <NGODashboard
          user={user}
          onEdit={() => nav("edit")}
          onDeleteAccount={handleDeleteAccount}
        />
      )}

      <Footer onNav={nav} />
    </>
  );
}

export default App;