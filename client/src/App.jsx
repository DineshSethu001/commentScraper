import { useState } from "react";
import axios from "axios";

import CommentCard from "./components/CommentCard";
import ScraperForm from "./components/ScraperForm";
import ResultsHeader from "./components/ResultsHeader";

function App() {
  const [url, setUrl] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  // Number of comments shown on each page
  const commentsPerPage = 5;

  // ================= GET UNIQUE AUTHORS =================

  const authors = [
    ...new Set(
      comments.map((comment) => comment.author)
    ),
  ];

  // ================= FILTER COMMENTS =================

  const filteredComments = comments.filter((comment) => {
    const matchesSearch = comment.text
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesAuthor =
      authorFilter === "all" ||
      comment.author === authorFilter;

    return matchesSearch && matchesAuthor;
  });

  // ================= SORT COMMENTS =================

  const displayedComments = [...filteredComments];

  if (sortBy === "author-asc") {
    displayedComments.sort((a, b) =>
      a.author.localeCompare(b.author)
    );
  }

  if (sortBy === "author-desc") {
    displayedComments.sort((a, b) =>
      b.author.localeCompare(a.author)
    );
  }

  // ================= PAGINATION =================

  const totalPages = Math.ceil(
    displayedComments.length / commentsPerPage
  );

  const startIndex =
    (currentPage - 1) * commentsPerPage;

  const endIndex =
    startIndex + commentsPerPage;

  const currentComments = displayedComments.slice(
    startIndex,
    endIndex
  );

  // ================= SCRAPE WEBSITE =================

  const handleScrape = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/scrape",
        {
          url,
        }
      );

      setComments(response.data.comments);

      // Reset filters
      setSearch("");
      setAuthorFilter("all");
      setSortBy("default");
      setCurrentPage(1);
    } catch (err) {
      console.log("error", err);

      setError("Failed to scrape website");
      setComments([]);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH HANDLER =================

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // ================= AUTHOR FILTER =================

  const handleAuthorFilter = (author) => {
    setAuthorFilter(author);
    setCurrentPage(1);
  };

  // ================= SORT HANDLER =================

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  // ================= PAGINATION =================

  const handlePrevious = () => {
    setCurrentPage((page) => page - 1);
  };

  const handleNext = () => {
    setCurrentPage((page) => page + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        {/* ================= HEADER ================= */}

        <header className="mb-8 text-center sm:mb-10">

          <div className="mb-4 inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-300 sm:text-sm">
            🕷️ Web Comment Analyzer
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Comment Scraper
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Enter a public webpage URL and extract available
            comments and feedback.
          </p>

        </header>

        {/* ================= SCRAPER FORM ================= */}

        <ScraperForm
          url={url}
          setUrl={setUrl}
          handleScrape={handleScrape}
          loading={loading}
        />

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            ❌ {error}
          </div>
        )}

        {/* ================= RESULTS ================= */}

        {comments.length > 0 && (
          <section className="mt-8 sm:mt-10">

            {/* Results Header */}

            <ResultsHeader
              count={comments.length}
            />

            {/* ================= SEARCH ================= */}

            <div className="mt-5">

              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search comments..."
                  value={search}
                  onChange={handleSearch}
                  className="
                    w-full
                    rounded-2xl
                    border border-slate-800
                    bg-slate-900
                    py-3
                    pl-11
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-600
                    transition
                    focus:border-cyan-500/40
                    focus:ring-2
                    focus:ring-cyan-500/10
                  "
                />

              </div>

            </div>

            {/* ================= FILTERS + SORT ================= */}

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              {/* Author Filters */}

              <div className="flex flex-wrap gap-2">

                {/* All */}

                <button
                  onClick={() =>
                    handleAuthorFilter("all")
                  }
                  className={`
                    rounded-full
                    px-4 py-2
                    text-sm font-medium
                    transition
                    ${
                      authorFilter === "all"
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white"
                    }
                  `}
                >
                  All
                </button>

                {/* Authors */}

                {authors.map((author) => (
                  <button
                    key={author}
                    onClick={() =>
                      handleAuthorFilter(author)
                    }
                    className={`
                      rounded-full
                      px-4 py-2
                      text-sm font-medium
                      transition
                      ${
                        authorFilter === author
                          ? "bg-cyan-400 text-slate-950"
                          : "border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white"
                      }
                    `}
                  >
                    {author}
                  </button>
                ))}

              </div>

              {/* Sort */}

              <select
                value={sortBy}
                onChange={handleSort}
                className="
                  w-full
                  rounded-xl
                  border border-slate-800
                  bg-slate-900
                  px-4 py-2.5
                  text-sm
                  text-slate-300
                  outline-none
                  focus:border-cyan-500/40
                  sm:w-auto
                "
              >
                <option value="default">
                  Default order
                </option>

                <option value="author-asc">
                  Author A → Z
                </option>

                <option value="author-desc">
                  Author Z → A
                </option>
              </select>

            </div>

            {/* ================= NO RESULTS ================= */}

            {filteredComments.length === 0 && (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-5 py-12 text-center">

                <div className="text-4xl">
                  🔍
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  No matching comments
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try a different search term or author.
                </p>

              </div>
            )}

            {/* ================= COMMENT CARDS ================= */}

            {currentComments.length > 0 && (
              <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                {currentComments.map((comment, index) => (
                  <CommentCard
                    key={`${comment.author}-${startIndex + index}`}
                    comment={comment}
                    index={startIndex + index}
                  />
                ))}

              </div>
            )}

            {/* ================= PAGINATION ================= */}

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

                {/* Previous */}

                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="
                    w-full
                    rounded-xl
                    border border-slate-800
                    bg-slate-900
                    px-4 py-2.5
                    text-sm text-slate-300
                    transition
                    hover:border-slate-700
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    sm:w-auto
                  "
                >
                  ← Previous
                </button>

                {/* Page */}

                <div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-sm text-slate-400">
                  Page{" "}
                  <span className="font-semibold text-white">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {totalPages}
                  </span>
                </div>

                {/* Next */}

                <button
                  onClick={handleNext}
                  disabled={
                    currentPage === totalPages
                  }
                  className="
                    w-full
                    rounded-xl
                    border border-slate-800
                    bg-slate-900
                    px-4 py-2.5
                    text-sm text-slate-300
                    transition
                    hover:border-slate-700
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    sm:w-auto
                  "
                >
                  Next →
                </button>

              </div>
            )}

          </section>
        )}

        {/* ================= EMPTY STATE ================= */}

        {comments.length === 0 &&
          !loading &&
          !error && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-5 py-14 text-center sm:mt-10 sm:px-6 sm:py-16">

              <div className="text-5xl">
                💬
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                No comments yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                Enter a URL above and click Scrape to see
                the extracted comments.
              </p>

            </div>
          )}

      </div>

    </div>
  );
}

export default App;