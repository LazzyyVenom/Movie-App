import { useEffect, useState } from 'react'
import './App.css'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

function App() {
  const [movies, setMovies] = useState([])
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  const fetchMovies = async (searchText = '') => {
    if (!apiKey) {
      setError('Add your TMDB API key to .env.local as VITE_TMDB_API_KEY to load movies.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const endpoint = searchText
      ? `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(searchText)}&include_adult=false&page=1`
      : `${TMDB_BASE_URL}/movie/popular?language=en-US&page=1`

    try {
      const response = await fetch(`${endpoint}&api_key=${apiKey}`)

      if (!response.ok) {
        throw new Error('Unable to load movies right now.')
      }

      const data = await response.json()
      const results = data.results || []

      setMovies(results)
      setFeaturedMovie(results[0] || null)
    } catch (err) {
      setError(err.message || 'Something went wrong while loading movies.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [apiKey])

  const handleSubmit = (event) => {
    event.preventDefault()
    fetchMovies(query.trim())
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-400">
              Fresh Picks
            </p>
            <h1 className="text-2xl font-black tracking-tight text-white">CineVerse</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies"
              className="w-full bg-transparent px-2 py-1 text-sm text-white outline-none placeholder:text-slate-400"
            />
            <button className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400">
              Search
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {featuredMovie && (
          <section className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: featuredMovie.backdrop_path
                  ? `url(${TMDB_IMAGE_BASE}${featuredMovie.backdrop_path})`
                  : 'linear-gradient(135deg, #111827, #0f172a)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />

            <div className="relative flex min-h-[420px] flex-col justify-end p-8 lg:p-12">
              <p className="mb-3 inline-flex w-fit rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-sm font-medium text-red-200">
                Now Trending
              </p>
              <h2 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                {featuredMovie.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                {featuredMovie.overview || 'A fresh movie pick curated for your next watch.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-200">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  ⭐ {featuredMovie.vote_average?.toFixed(1)} / 10
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  {featuredMovie.release_date?.slice(0, 4) || 'TBA'}
                </span>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
                Discover
              </p>
              <h3 className="text-2xl font-bold text-white">Popular movies</h3>
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
              Loading fresh movies...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-200">
              {error}
            </div>
          )}

          {!loading && !error && movies.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
              No movies found. Try another search.
            </div>
          )}

          {!loading && !error && movies.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {movies.map((movie) => (
                <article key={movie.id} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80 shadow-lg shadow-black/20">
                  <img
                    src={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                    alt={movie.title}
                    className="h-72 w-full object-cover"
                  />
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h4 className="text-lg font-semibold text-white">{movie.title}</h4>
                      <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-200">
                        {movie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-400">
                      {movie.overview?.slice(0, 120) || 'A standout movie waiting to be discovered.'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
