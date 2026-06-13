export default function AdminPagePlaceholder() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="glass rounded-2xl p-10 text-center max-w-sm w-full">
        <h1 className="text-3xl font-black neon-text tracking-widest mb-3">IRFX Admin</h1>
        <div
          className="mx-auto w-24 h-px mb-4"
          style={{ background: 'linear-gradient(90deg,transparent,var(--color-cyan),transparent)' }}
        />
        <p className="text-sm text-[var(--color-text-muted)]">Phase 6 — Admin pages coming soon</p>
      </div>
    </div>
  );
}
