"use client"
import logoutAction from "@/actions/logoutAction";
import { useActionState } from "react";

export default function LogoutBtn() {
  const [state, onLogout, isPending] = useActionState(logoutAction, {
    error: null as string | null,
    success: null as string | null,
  });

  return (
    <>
      <form action={onLogout}>
        <button
          type="submit"
          disabled={isPending}
          className="hover:text-red-500 transition-colors text-left cursor-pointer"
        >
          {isPending ? " Logging out..." : "Logout"}
        </button>
      </form>
    </>
  );
}
