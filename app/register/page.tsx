"use client";
import "@/app/login.css";
import logo from "@/public/logo.avif";
import Image from "next/image";
import { useActionState, useState } from "react";
import registerAction from "@/actions/registerAction";
import Link from "next/link";

export default function RegisterUser() {
  const [state, formAction, isPending] = useActionState(registerAction, {
    error: null as string | null,
    success: null as string | null,
  });
  const [passwords, setPasswords] = useState({
    password: "",
    confirm_password: "",
  });
  const [screenError, setScreenError] = useState(false);

  function checkPassword() {
    if (passwords.password !== passwords.confirm_password) {
      setScreenError(true);
    } else {
      setScreenError(false);
    }
    console.log("STATE=>", state.error, state.success);
  }
  return (
    <div className="login-section">
      <div className="login-section-wrapper relative">
        <div className="logo-login">
          <Image src={logo} alt="logo" placeholder="blur" className="w-40" />
        </div>
        {screenError && (
          <p className="text-red-500 text-sm top-12 absolute">
            Password and Confirm password should match!!
          </p>
        )}
        {state.success && (
          <p className="text-green-600 text-sm top-12 absolute">
            {state.success}
          </p>
        )}
        <div className="login-form-wrapper">
          <h2>New User Registration</h2>
          <form action={formAction}>
            <div className="form-content">
              <label>Name</label>
              <input type="text" name="name" required />
            </div>
            <div className="form-content">
              <label>Email</label>
              <input type="email" name="email" required />
            </div>

            <div className="form-content">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={passwords.password}
                required
                onChange={(e) =>
                  setPasswords({ ...passwords, password: e.target.value })
                }
              />
            </div>
            <div className="form-content">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                required
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirm_password: e.target.value,
                  })
                }
                onBlur={checkPassword}
              />
            </div>
            <div className="login-btn-section relative">
              {state.error && (
                <p className="text-red-500 top-[-2rem] text-sm left-1/2 -translate-x-1/2 absolute w-full">
                  {state.error}
                </p>
              )}
              <button className="login-btn-loginform" disabled={screenError}>
                {isPending ? "Registering" : "Register"}
              </button>
              <span>
                <Link href="/login">Already have account?</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
