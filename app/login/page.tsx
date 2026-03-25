"use client";
import google_logo from "@/public/logo-google.png";
import logo from "@/public/logo.avif";
import Image from "next/image";
import "@/app/login.css";
import { useActionState } from "react";
import { loginAction } from "@/actions/loginAction";
export default function UserLogin() {
  function closeLogin() {}

  const [state, formAction, isPending] = useActionState<{
    error: string | null;
  }>(loginAction, { error: null });

  return (
    <div className="login-section">
      <div className="login-section-wrapper">
        <div className="logo-login">
          <Image src={logo} alt="logo" placeholder="blur" className="w-40" />
        </div>
        <div className="login-form-wrapper">
          <h2>Login</h2>
          <form>
            <div className="form-content">
              <label>Email</label>
              <input type="email" name="email" required />
            </div>
            <div className="form-content">
              <label>Password</label>
              <input type="password" name="password" required />
            </div>
            <div className="check-box">
              <input type="checkbox" />
              <span>Remember me</span>
            </div>

            <div className="login-btn-section relative">
              {state.error && <p className="text-red-500 top-[-2rem] text-sm left-1/2 -translate-x-1/2 absolute">Error in login</p>}
              <button className="login-btn-loginform">
                {isPending ? "Submitting" : "Login"}
              </button>
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
