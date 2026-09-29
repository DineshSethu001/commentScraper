function ScraperForm({
  url,
  setUrl,
  handleScrape,
  loading,
}) {
  return (
    <section className="w-full">
      <div
        className="
          relative w-full overflow-hidden
          rounded-2xl sm:rounded-3xl
          border border-slate-800
          bg-[#0b1120]
          shadow-2xl shadow-black/20
        "
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative w-full p-4 sm:p-6 lg:p-8">

          {/* Header */}
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-xs">
                Scraper Engine
              </p>

              <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                Extract comments from a webpage
              </h2>
            </div>

            {/* Status */}
            <div
              className="
                inline-flex w-fit items-center gap-2
                rounded-full
                border border-emerald-500/20
                bg-emerald-500/10
                px-3 py-1.5
                text-xs font-medium
                text-emerald-400
              "
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              {loading ? "Working" : "Ready"}
            </div>
          </div>

          {/* Input + Button */}
          <div
            className="
              flex w-full flex-col
              gap-3
              rounded-2xl
              border border-slate-800
              bg-slate-950/80
              p-2
              sm:flex-row
            "
          >
            {/* Input */}
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3">
              <span className="shrink-0 text-lg text-slate-500">
                ↗
              </span>

              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="
                  min-w-0 w-full
                  bg-transparent
                  py-3
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-slate-600
                  sm:text-base
                "
              />
            </div>

            {/* Button */}
            <button
              onClick={handleScrape}
              disabled={loading}
              className="
                w-full shrink-0
                rounded-xl
                bg-white
                px-6 py-3
                text-sm font-bold
                text-slate-950
                transition-all duration-200
                hover:bg-cyan-300
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
                sm:min-w-[150px]
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-950" />
                  Scraping...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Start Scrape
                  <span className="text-lg">→</span>
                </span>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Enter a publicly accessible webpage URL.
            </span>

            <span className="font-mono text-slate-600">
              POST /api/scrape
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ScraperForm;