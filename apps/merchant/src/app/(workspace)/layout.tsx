import { MerchantLayout } from "zap-design/src/genesis/organisms/merchant-workspace-layout";
import { WorkspaceNav } from "./workspace-nav";
import { WorkspaceInspector } from "./workspace-inspector";
import { getSession } from "@olympus/zap-auth/src/actions";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  // Double-security check
  if (!session) {
    redirect("http://localhost:4700/auth/metro/user-management");
  }

  return (
    <MerchantLayout>
      <WorkspaceNav user={session} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {children}
      </div>
      <WorkspaceInspector />
    </MerchantLayout>
  );
}
