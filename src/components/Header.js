function Header({ user, goHome, goAbout, goHow, goLogin, goRegister, logout }) {
  return (
    <div className="header">
      <div className="header-left" onClick={goHome}>
        {/* Increased logo size slightly to 55px */}
        <img 
          src="/logo.jpeg" 
          alt="Logo" 
          style={{ height: '55px', width: 'auto', borderRadius: '8px' }} 
        />
        <h2>Food Link</h2>
      </div>

      <div className="nav-menu">
        <span onClick={goHome}>Home</span>
        <span onClick={goAbout}>About Us</span>
        <span onClick={goHow}>How It Works</span>
      </div>

      <div className="header-right">
  {!user ? (
    <>
      {/* Changed class to transparent-btn */}
      <button onClick={goLogin} className="transparent-btn">Login</button>
      <button className="primary-btn" onClick={goRegister}>Get Started</button>
    </>
  ) : (
    <button className="primary-btn" onClick={logout}>Logout</button>
  )}
</div>
    </div>
  );
}

export default Header;