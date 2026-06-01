import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="mx-auto w-full max-w-7xl px-6 pt-8 sm:px-10">
        <a href="/" className="inline-flex items-center gap-2.5">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 text-sage"
            aria-hidden="true"
          >
            <path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Flash Company
          </span>
        </a>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="flex flex-col items-start">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            Turn a promising group chat into a{" "}
            <span className="text-sage">testable business.</span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
            A 2-day AI-guided sprint that helps small groups find their
            strongest shared opportunity, define the customer and problem, and
            launch a simple validation page.
          </p>

          <a
            href="/demo"
            className="group mt-10 inline-flex h-14 items-center gap-3 rounded-2xl bg-sage px-8 text-lg font-bold text-white shadow-lg shadow-sage/30 transition-colors hover:bg-sage-dark"
          >
            Run a sprint
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>

          <div className="mt-8 flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path d="m5 12 5 5L20 7" />
              </svg>
            </span>
            <p className="text-base font-medium text-slate-600">
              AI-guided. Small group friendly. Outcome focused.
            </p>
          </div>
        </div>

        <div className="w-full">
          <Image
            src="/venn.png"
            alt="Skills, Networks, and Insights overlap to reveal your best venture opportunity"
            width={1254}
            height={1254}
            priority
            className="h-auto w-full"
          />
        </div>
      </main>
    </div>
  );
}
