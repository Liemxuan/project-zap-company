export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--md-sys-color-background)] text-[var(--md-sys-color-on-background)]">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--md-sys-color-surface)]">
        {children}
      </main>
    </div>
  );
}
