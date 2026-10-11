type StatCardProps = {
  label: string;
  value: string;
  accent?: boolean;
};

export function StatCard({ label, value, accent = false }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p
        className={`mt-3 text-3xl font-bold ${
          accent ? "text-cyan-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
