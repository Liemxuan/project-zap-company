import { M3PreviewDashboard } from "./m3-preview-dashboard";

export default function M3PreviewPage() {
  return (
    <div className="min-h-screen text-foreground font-sans">
      <div className="max-w-[1600px] mx-auto p-8">
        <header className="mb-12 border-b border-border pb-6">
          <h1 className="text-4xl font-bold tracking-tight mb-2">ZAP M3 Engine Preview</h1>
          <p className="text-muted-foreground text-title-small">
            Live visualization of the @material/material-color-utilities HCT algorithms.
            This demonstrates the mathematical foundation of our ZAP Design System before Tailwind compilation.
          </p>
        </header>

        <M3PreviewDashboard />
      </div>
    </div>
  );
}
