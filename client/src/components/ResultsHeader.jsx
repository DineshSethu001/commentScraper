function ResultsHeader({ count }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:flex-row sm:items-center sm:justify-between">
      
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Scrape Results
        </p>

        <h2 className="mt-1 text-2xl font-bold text-white">
          Comments extracted
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Data successfully parsed from the webpage.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-center">
          <p className="text-2xl font-bold text-white">
            {count}
          </p>

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Comments
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
          ✓
        </div>
      </div>

    </div>
  );
}

export default ResultsHeader;