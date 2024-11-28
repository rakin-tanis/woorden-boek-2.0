import WelcomePage from "@/components/WelcomePage";

export default function Home() {
  return (
    <div className="min-h-screen overflow-auto">
      <main className="relative">
        <div className="min-h-screen flex flex-col">
          <div className="relative min-h-screen flex flex-col">
            {/* Header height spacer */}
            <div className="h-[6.4rem] w-full"></div>

            <div className="flex-grow px-2 py-4 scroll-pt-24 md:scroll-pt-36 scroll-pb-[33vh] flex items-center justify-center min-h-full">
              <WelcomePage />
            </div>

            {/* Keyboard height spacer */}
            <div
              className="-z-50 h-[33vh] w-full"
              style={{
                // Dynamically set height to match actual keyboard
                height: `calc(var(--keyboard-height, 33vh))`
              }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  );
}
