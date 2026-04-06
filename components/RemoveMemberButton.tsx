"use client";

import { removeMemberAction } from "@/app/admin/equipe/actions";

export default function RemoveMemberButton({ userId, name }: { userId: string; name: string }) {
  return (
    <form action={removeMemberAction} className="inline">
      <input type="hidden" name="user_id" value={userId} />
      <button
        type="submit"
        className="text-xs text-brun-light hover:text-rose"
        onClick={(e) => {
          if (!confirm(`Retirer ${name} de l'équipe ?`)) {
            e.preventDefault();
          }
        }}
      >
        Retirer
      </button>
    </form>
  );
}
