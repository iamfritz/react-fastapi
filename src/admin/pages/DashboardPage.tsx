export function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
            Admin
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white">
            Store dashboard
          </h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Products</p>
          <p className="mt-3 text-3xl font-bold text-white">12</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Blog posts</p>
          <p className="mt-3 text-3xl font-bold text-white">8</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Status</p>
          <p className="mt-3 text-xl font-semibold text-cyan-300">Live</p>
        </div>
      </div>
    </main>
  );
}
