import { FoundationLogin } from 'zap-design/src/components/ui/FoundationLogin';
import { cookies } from 'next/headers';
import { loginAction } from '@olympus/zap-auth/src/actions';
import { DynamicMermaidBox } from 'zap-design/src/components/ui/DynamicMermaidBox';

const webChart = `
flowchart TD
  Customer(["👨‍👩‍👦 Customer"])
  Web["🌐 Web App (Here)"]
  Auth["🛡️ ZAP-Auth (SSO)"]
  Ops["📦 ZAP-Ops (Logic)"]
  DB["💾 ZAP-DB"]
  AI["🧠 ZAP-AI (Brain)"]

  Customer -->|1. Browses Menu| Web
  Web -->|2. Validates Session| Auth
  Web -->|3. Fetches Items| Ops
  Ops -->|4. Reads Data| DB
  Web -.->|5. Recommends Items| AI
`;

export default async function WebBlueprint() {
  const cookieStore = await cookies();
  const session = cookieStore.get('zap_session');

  if (!session) {
    return (
      <FoundationLogin 
        appName="Consumer Web Storefront"
        description="The public-facing e-commerce application. Focuses heavily on SEO, server-side rendering, and high-conversion consumer user experiences."
        duties={[
            "Provide fluid, responsive browsing of the product catalog.",
            "Process consumer authentication via unified ZAP-Auth SSO.",
            "Display personalized recommendations powered by ZAP-AI.",
            "Route digital payments securely through ZAP-Ops."
        ]}
        onLogin={loginAction}
      />
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-12 bg-zinc-950 text-white font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-sky-400">Consumer Web App</h1>
            <p className="text-xl text-zinc-400">Endpoint: <code className="bg-zinc-800 px-2 py-1 rounded">localhost:3000</code></p>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-3">Newbie Instructions:</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li>This is the public-facing e-commerce / ordering website.</li>
              <li>Focus on SEO, performance, and consumer UX.</li>
              <li>Customers log in here using traditional SSO (Email/OAuth) via <code>zap-auth</code>.</li>
              <li>This app has the highest traffic. All data fetching routes through <code>zap-ops</code>.</li>
            </ul>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl">
          <h2 className="text-lg font-bold mb-6 tracking-widest uppercase text-zinc-500">Operation Flowchart</h2>
          <DynamicMermaidBox chart={webChart} />
        </div>

      </div>
    </main>
  );
}
