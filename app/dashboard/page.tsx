"use client"
import logoutAction from "@/actions/logoutAction";
import { useActionState } from "react";

export default function DashboardPage() {
  const [state, onLogout, isPending] = useActionState(logoutAction, {
    error: null as string | null,
    success: null as string | null
  });
  return (
    <>
      <h1>Welcome to Dashbaord Ravindra</h1>
      <form action={onLogout}>
        <button type="submit" disabled={isPending}>
          {isPending ? " Logging out..." : "Logout"}
        </button>
      </form>
    </>
  );
}
