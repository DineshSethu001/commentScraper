function CommentCard({ comment, index }) {
  return (
    <article
      className="
        group relative overflow-hidden
        rounded-[26px]
        border border-slate-800
        bg-[#0b1120]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-cyan-500/30
        hover:shadow-2xl hover:shadow-cyan-500/5
      "
    >

      {/* Hover glow */}
      <div
        className="
          pointer-events-none absolute
          -right-16 -top-16
          h-40 w-40
          rounded-full
          bg-cyan-400/5
          blur-3xl
          transition duration-500
          group-hover:bg-cyan-400/10
        "
      />

      <div className="relative flex">

        {/* Number rail */}
        <div
          className="
            flex w-16 shrink-0
            flex-col items-center
            border-r border-slate-800
            bg-slate-950/50
            py-6
          "
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            ID
          </span>

          <span className="mt-2 font-mono text-sm font-bold text-cyan-400">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="mt-auto h-10 w-px bg-gradient-to-b from-cyan-500/60 to-transparent" />
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 p-6 sm:p-7">

          {/* Author section */}
          <div className="flex items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">

              {/* Avatar */}
              <div
                className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-xl
                  border border-cyan-400/20
                  bg-cyan-400/10
                  font-bold text-cyan-300
                "
              >
                {comment.author?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-semibold text-white">
                  {comment.author}
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Public comment
                </p>
              </div>

            </div>

            {/* Status */}
            <span
              className="
                shrink-0 rounded-full
                border border-emerald-500/20
                bg-emerald-500/10
                px-3 py-1
                text-[10px] font-semibold
                uppercase tracking-wider
                text-emerald-400
              "
            >
              Extracted
            </span>

          </div>

          {/* Comment */}
          <div className="relative mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

            <span className="absolute -left-1 -top-4 font-serif text-5xl leading-none text-cyan-400/20">
              “
            </span>

            <p className="pl-3 text-sm leading-7 text-slate-300 sm:text-[15px]">
              {comment.text}
            </p>

          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between">

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Successfully parsed
            </div>

            <span className="font-mono text-[10px] text-slate-700">
              COMMENT_{String(index + 1).padStart(3, "0")}
            </span>

          </div>
<div className="mt-4 flex flex-wrap items-center gap-3">
  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
    ⭐ {comment.rating}/5
  </span>

  <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-500">
    📅 {comment.date}
  </span>
</div>
        </div>
      </div>
    </article>
  );
}

export default CommentCard;