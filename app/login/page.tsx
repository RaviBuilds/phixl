"use client";
import google_logo from "@/public/logo-google.png";
import Image from "next/image";

export default function UserLogin() {
  function closeLogin() {}
  return (
    <div className="login-section">
      <div className="login-section-wrapper">
        <div className="logo-login">
          <img src="/src/assets/logo.avif" alt="logo" />
        </div>
        <div className="login-form-wrapper">
          <h2>Login</h2>
          <form>
            <div className="form-content">
              <label>Email</label>
              <input type="email" required />
            </div>
            <div className="form-content">
              <label>Password</label>
              <input type="text" required />
            </div>
            <div className="check-box">
              <input type="checkbox" />
              <span>Remember me</span>
            </div>

            <div className="login-btn-section">
              <button className="login-btn-loginform">Login</button>
              <span>Forgot your passord?</span>
            </div>
          </form>
          <div className="login-via">
            <span>Or Login Via</span>
          </div>
          <button className="google-btn">
            <Image src={google_logo} alt="google" placeholder="blur" />
            <span>Google</span>
          </button>
          <div className="register-link">
            <span>Don't have an account?</span>
            <p>Register now</p>
          </div>
        </div>
        <div className="back-to-home" onClick={closeLogin}>
          Back to HomePage
        </div>
      </div>
    </div>
  );
}
