import { useState, useEffect } from "react"; // Added useEffect
import "./App.css";

import Header from "./components/Header";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import RestaurantDashboard from "./components/RestaurantDashboard";
import NGODashboard from "./components/NGODashboard";
import EditProfile from "./components/EditProfile";
import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowItWorks";
import Footer from './components/Footer';

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  // --- GLOBAL SCROLL TO TOP ON PAGE CHANGE ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // --- DELETE ACCOUNT LOGIC ---
  const deleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      const filtered = allUsers.filter(u => u.userId !== user.userId);
      localStorage.setItem("users", JSON.stringify(filtered));
      setUser(null); 
      setPage("home");
      alert("Account deleted successfully.");
    }
  };

  return (
    <>
      <Header
        user={user}
        goHome={() => setPage("home")}
        goAbout={() => setPage("about")}
        goHow={() => setPage("how-it-works")}
        goLogin={() => setPage("login")}
        goRegister={() => setPage("register")}
        logout={() => { setUser(null); setPage("home"); }}
      />

      {page === "home" && <Home goRegister={() => setPage("register")} />}
      {page === "about" && <AboutUs />}
      {page === "how-it-works" && <HowItWorks />}

      {page === "register" && (
        <Register goLogin={() => setPage("login")} />
      )}

      {page === "login" && (
        <Login
          setUser={setUser}
          goDashboard={(role) =>
            role === "restaurant"
              ? setPage("restaurant")
              : setPage("ngo")
          }
        />
      )}

      {page === "edit" && user && (
        <EditProfile
          user={user}
          setUser={setUser}
          goBack={() =>
            setPage(user.role === "restaurant" ? "restaurant" : "ngo")
          }
        />
      )}

      {page === "restaurant" && user && (
        <RestaurantDashboard
          user={user}
          goEdit={() => setPage("edit")}
          deleteAccount={deleteAccount}
        />
      )}

      {page === "ngo" && user && (
        <NGODashboard 
          user={user} 
          logout={() => { setUser(null); setPage("home"); }} 
          goEdit={() => setPage("edit")} 
          deleteAccount={deleteAccount}
        />
      )}

      <Footer 
        goHome={() => setPage("home")} 
        goAbout={() => setPage("about")} 
        goHow={() => setPage("how-it-works")} 
      />
    </>
  );
}

export default App;