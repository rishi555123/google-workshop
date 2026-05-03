import { useState } from "react";

function Header({ user, currentPage, onNav, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (page, label) => (
    <button
      onClick={() => { onNav(page); setMenuOpen(false); }}
      style={{ fontWeight: currentPage === page ? 800 : 600,
               color: currentPage === page ? "var(--primary)" : undefined }}
    >
      {label}
    </button>
  );

  return (
    <header className="header">
      <div className="header-logo" onClick={() => onNav("home")}>
        <img src="/logo.jpeg" alt="Food Link logo" />
        <span>Food Link</span>
      </div>

      <nav className={`nav-links${menuOpen ? " open" : ""}`}>
        {navLink("home",         "Home")}
        {navLink("about",        "About Us")}
        {navLink("how-it-works", "How It Works")}
      </nav>

      <div className="nav-actions">
        {!user ? (
          <>
            <button className="btn btn-ghost" onClick={() => onNav("login")}>
              Login
            </button>
            <button className="btn btn-primary" onClick={() => onNav("register")}>
              Get Started
            </button>
          </>
        ) : (
          <button className="btn btn-danger btn-sm" onClick={onLogout}>
            Logout
          </button>
        )}
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}

export default Header;