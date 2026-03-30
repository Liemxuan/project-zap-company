"use client";

import { usePathname, useRouter } from "next/navigation";
import { MerchantSideNav } from "zap-design/src/genesis/organisms/merchant-workspace-layout";
import { Sparkles, Store, Activity, BarChart } from "lucide-react";

export function WorkspaceNav({ user }: { user?: any }) {
  const pathname = usePathname();
  const router = useRouter();

  // Derive active department from path
  const activeDepartment = 
    pathname.startsWith("/builder") ? "builder" :
    pathname.startsWith("/ai") ? "ai" :
    pathname.startsWith("/swarm") ? "swarm" : 
    "command";

  const handleNav = (id: string) => {
    switch (id) {
      case "builder":
        router.push("/builder");
        break;
      case "ai":
        router.push("/ai");
        break;
      case "swarm":
        router.push("/swarm");
        break;
      case "command":
      default:
        router.push("/");
        break;
    }
  };

  const UserProfile = user ? (
    <div className="flex items-center gap-3 w-full bg-layer-base/50 p-2 rounded-lg cursor-pointer hover:bg-layer-base transition-colors">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm shrink-0">
        {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="font-bold text-sm text-on-surface truncate">{user.name || 'Merchant'}</span>
        <span className="text-xs text-on-surface-variant truncate">{user.email || 'operator@zap.vn'}</span>
      </div>
    </div>
  ) : null;

  return (
    <MerchantSideNav
      activeDepartment={activeDepartment}
      navItems={[
        { id: "command", label: "Command Center", icon: <BarChart size={16} />, onClick: () => handleNav("command") },
        { id: "builder", label: "Store Builder", icon: <Store size={16} />, onClick: () => handleNav("builder") },
        { id: "ai", label: "AI Assistant", icon: <Sparkles size={16} />, onClick: () => handleNav("ai") },
        { id: "swarm", label: "Swarm Ops", icon: <Activity size={16} />, onClick: () => handleNav("swarm") },
      ]}
      bottomSlot={UserProfile}
    />
  );
}
