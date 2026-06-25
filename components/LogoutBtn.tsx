"use client";
import logoutAction from "@/actions/logoutAction";
import { useActionState } from "react";

export default function LogoutBtn() {
  // THE FIX: Remove the 'as string | null' casting from success
  const [state, onLogout, isPending] = useActionState(logoutAction, {
    error: null as string | null,
    success: null,
  });

  return (
    <form action={onLogout}>
      <button
        type="submit"
        disabled={isPending}
        className="hover:text-red-brand-light transition-colors text-left cursor-pointer"
      >
        {isPending ? "Logging out..." : "Logout"}
      </button>
    </form>
  );
}
