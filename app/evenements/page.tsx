import Link from "next/link";
import { fetchEvenements } from "@/lib/api";
import { evenements as mockEvenements } from "@/data/evenements";
import EvenementCard from "@/components/EvenementCard";
import { EtoileOrange } from "@/components/Motifs";

export default async function EvenementsPage() {
  const today = new Date().toISOString().split("T")[0];

  // Événements à venir (date >= aujourd'hui, triés par date croissante)
  const { evenements: aVenir } = await fetchEvenements({
    limit: 20,
    date_from: today,
    sort_by: "event_date",
    sort_order: "asc",
  });

  // Événements passés (date < aujourd'hui, triés par date décroissante)
  const { evenements: passes } = await fetchEvenements({
    limit: 20,
    date_to: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    sort_by: "event_date",
    sort_order: "desc",
  });

  // Fallback sur les données mockées si l'API ne retourne rien
  const hasApiData = aVenir.length > 0 || passes.length > 0;
  const mockAVenir = mockEvenements.filter((e) => !e.est_passe);

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl text-brun">
            Événements
          </h1>
          <p className="mt-3 text-lg text-brun-light">
            Banquets, ateliers, marchés et rencontres — retrouvez-nous sur le
            terrain.
          </p>
        </div>

        {/* Section À venir */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <EtoileOrange className="w-6 h-6" />
            <h2 className="font-serif text-2xl sm:text-3xl text-brun">
              À venir
            </h2>
          </div>

          {(hasApiData ? aVenir : mockAVenir).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(hasApiData ? aVenir : mockAVenir).map((evt) => (
                <EvenementCard key={evt.id} evenement={evt} variant="upcoming" />
              ))}
            </div>
          ) : (
            <p className="text-brun-light py-8 text-center">
              Pas d&apos;événement prévu pour le moment — restez connectés !
            </p>
          )}
        </section>

        {/* Section Passés */}
        {passes.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl text-brun-light">
                Événements passés
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {passes.map((evt) => (
                <EvenementCard key={evt.id} evenement={evt} variant="past" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
