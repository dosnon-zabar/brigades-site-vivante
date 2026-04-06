export const dynamic = "force-dynamic";

import { evenements } from "@/data/evenements";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminEvenementsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-brun">Événements</h1>
          <p className="text-brun-light mt-1">
            Gérer les événements du collectif
          </p>
        </div>
        <button className="px-4 py-2 bg-orange text-white font-medium rounded-lg hover:bg-orange-light transition-colors text-sm">
          + Nouvel événement
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-creme-dark/50">
              <th className="text-left px-5 py-3 text-brun-light font-medium">Titre</th>
              <th className="text-left px-5 py-3 text-brun-light font-medium">Date</th>
              <th className="text-left px-5 py-3 text-brun-light font-medium">Places</th>
              <th className="text-left px-5 py-3 text-brun-light font-medium">Statut</th>
              <th className="text-right px-5 py-3 text-brun-light font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {evenements.map((e) => (
              <tr key={e.id} className="border-b border-creme-dark/30 last:border-0 hover:bg-creme/50">
                <td className="px-5 py-3 text-brun font-medium">{e.titre}</td>
                <td className="px-5 py-3 text-brun-light">{formatDate(e.date)}</td>
                <td className="px-5 py-3 text-brun-light">{e.nombre_places}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    e.est_passe
                      ? "bg-brun-light/10 text-brun-light"
                      : "bg-vert-eau/15 text-vert-eau"
                  }`}>
                    {e.est_passe ? "Passé" : "À venir"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-xs text-orange hover:text-orange-light mr-3">Modifier</button>
                  <button className="text-xs text-brun-light hover:text-brun">Voir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
