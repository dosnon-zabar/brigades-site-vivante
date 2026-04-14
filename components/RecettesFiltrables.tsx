"use client";

import { useState } from "react";
import type { Recette } from "@/lib/types";
import RecetteCard from "./RecetteCard";

const SAISONS = ["Printemps", "Été", "Automne", "Hiver"];

type Props = {
  recettes: Recette[];
  allTags: string[];
};

export default function RecettesFiltrables({ recettes, allTags }: Props) {
  const [saisonsActives, setSaisonsActives] = useState<Set<string>>(new Set());
  const [tagsActifs, setTagsActifs] = useState<Set<string>>(new Set());

  const toutes = saisonsActives.size === 0;
  const aucunTag = tagsActifs.size === 0;

  function toggleSaison(saison: string) {
    setSaisonsActives((prev) => {
      const next = new Set(prev);
      if (next.has(saison)) next.delete(saison);
      else next.add(saison);
      return next;
    });
  }

  function toggleTag(tag: string) {
    setTagsActifs((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  const filtered = recettes.filter((r) => {
    if (!toutes) {
      const recetteSaisons = r.saison.split(/,\s*/);
      if (!recetteSaisons.some((s) => saisonsActives.has(s))) return false;
    }
    if (!aucunTag) {
      if (!r.tags.some((t) => tagsActifs.has(t))) return false;
    }
    return true;
  });

  return (
    <>
      {/* Filtres */}
      <div className="mb-8 space-y-4">
        <div>
          <span className="text-sm font-medium text-brun mr-3">Saison :</span>
          <button
            onClick={() => setSaisonsActives(new Set())}
            className={`text-xs px-3 py-1 rounded-full mr-2 mb-2 uppercase transition-colors ${
              toutes
                ? "bg-vert-eau text-white"
                : "bg-stone-100 text-brun-light hover:bg-vert-eau/10"
            }`}
          >
            Toutes
          </button>
          {SAISONS.map((saison) => (
            <button
              key={saison}
              onClick={() => toggleSaison(saison)}
              className={`text-xs px-3 py-1 rounded-full mr-2 mb-2 uppercase transition-colors ${
                saisonsActives.has(saison)
                  ? "bg-vert-eau text-white"
                  : "bg-stone-100 text-brun-light hover:bg-vert-eau/10"
              }`}
            >
              {saison}
            </button>
          ))}
        </div>
        {allTags.length > 0 && (
          <div>
            <span className="text-sm font-medium text-brun mr-3">Tags :</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1 rounded-full mr-2 mb-2 uppercase transition-colors ${
                  tagsActifs.has(tag)
                    ? "bg-vert-eau text-white"
                    : "bg-stone-100 text-brun-light hover:bg-vert-eau/10"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grille */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((recette) => (
            <RecetteCard key={recette.id} recette={recette} />
          ))}
        </div>
      ) : (
        <p className="text-brun-light text-center py-12">
          Aucune recette pour ces filtres.
        </p>
      )}
    </>
  );
}
