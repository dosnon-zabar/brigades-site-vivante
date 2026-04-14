import type { Metadata } from "next";
import { fetchRecettes, fetchSiteConfig } from "@/lib/api";
import RecettesFiltrables from "@/components/RecettesFiltrables";

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchSiteConfig();
  return {
    title: config?.recipes_seo_title ?? "Nos recettes",
    description: config?.recipes_seo_desc ?? undefined,
    openGraph: config?.recipes_seo_image ? { images: [config.recipes_seo_image] } : undefined,
  };
}

export default async function RecettesPage() {
  const [config, { recettes }] = await Promise.all([
    fetchSiteConfig(),
    fetchRecettes({ limit: 50, status: "publiee", sort_by: "created_at", sort_order: "desc" }),
  ]);

  const allTags = [...new Set(recettes.flatMap((r) => r.tags))];

  return (
    <div className="relative py-12 sm:py-16 overflow-hidden">
      <img src="/picto-soleil.png" alt="" className="absolute -top-16 -right-16 w-48 sm:w-64 opacity-25 pointer-events-none" />
      <img src="/picto-etoile.png" alt="" className="absolute bottom-20 left-[5%] w-20 sm:w-28 opacity-20 pointer-events-none rotate-12 hidden sm:block" />
      <img src="/picto-onde.png" alt="" className="absolute top-[33%] right-[6%] w-12 sm:w-16 opacity-20 pointer-events-none -rotate-12 hidden sm:block" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="font-serif text-5xl sm:text-6xl text-brun">
            {config?.recipes_page_title ?? "Nos recettes"}
          </h1>
          {config?.recipes_intro ? (
            <div className="mt-3 text-lg text-brun-light" dangerouslySetInnerHTML={{ __html: config.recipes_intro }} />
          ) : (
            <p className="mt-3 text-lg text-brun-light">
              Recettes provençales et méditerranéennes, à cuisiner et à partager.
            </p>
          )}
        </div>

        <RecettesFiltrables recettes={recettes} allTags={allTags} />
      </div>
    </div>
  );
}
