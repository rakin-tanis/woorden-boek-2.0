import LanguageGame from "@/components/LanguageGame";

export default function Home() {
  return (
    <div className="h-lvh font-[family-name:var(--font-geist-sans)]">
      <main>
        <div className="flex flex-col items-center justify-center h-lvh text-sm text-center font-[family-name:var(--font-geist-mono)]">
          {/* <div className="mb-2">
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 font-semibold">
              Zeer binnenkort.
            </code>
          </div>
          <div>
            Het zal het wachten waard zijn.
          </div> */}
          <LanguageGame></LanguageGame>
        </div>
      </main>
    </div>
  );
}
