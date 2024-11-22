import WelcomePage from "@/components/WelcomePage";

export default function Home() {
  return (
    <div className="h-lvh font-[family-name:var(--font-geist-sans)]">
      <main>
        <div className="flex flex-col items-center justify-center h-lvh text-sm text-center font-[family-name:var(--font-geist-mono)]">
          <WelcomePage></WelcomePage>
        </div>
      </main>
    </div>
  );
}
