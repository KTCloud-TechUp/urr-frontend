import { Button } from "@/shared/ui/Button";
import { Home, Music2, Library, Search, Bell, Disc, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/ui/Button"; // Re-using cn utility

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    href?: string;
    isAction?: boolean;
}

function SidebarItem({ icon: Icon, label, active, href = "#", isAction }: SidebarItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            )}
        >
            <Icon className={cn("h-5 w-5", active ? "text-white" : "text-neutral-400")} />
            <span>{label}</span>
            {isAction && <span className="ml-auto bg-neutral-800 text-[10px] px-1.5 py-0.5 rounded border border-neutral-700">+ Create</span>}
        </Link>
    );
}

export function Sidebar({ className }: { className?: string }) {
    return (
        <div className={cn("w-64 bg-black flex flex-col border-r border-neutral-900 h-screen sticky top-0", className)}>
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-2">
                {/* Simple SVG Logo Placeholder */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="white" />
                    <path d="M10 16L16 22L22 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xl font-bold tracking-tight text-white">SUNO</span>
            </div>

            {/* User Area */}
            <div className="px-4 mb-6">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-900 cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">test</span>
                        <span className="text-xs text-neutral-500">40 credits</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                <SidebarItem icon={Home} label="Home" />
                <SidebarItem icon={Music2} label="Create" active isAction />
                <SidebarItem icon={Disc} label="Studio" />
                <SidebarItem icon={Library} label="Library" />
                <SidebarItem icon={Search} label="Search" />
            </nav>

            {/* Secondary Nav */}
            <nav className="px-4 mt-6 space-y-1">
                <SidebarItem icon={Disc} label="Hooks" /> {/* Icon placeholder for 'Hooks' */}
            </nav>

            {/* Bottom Area */}
            <div className="p-4 mt-auto space-y-4">
                <SidebarItem icon={Bell} label="Notifications" />

                {/* Go Pro Card */}
                <div className="rounded-xl p-4 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-600/30">
                    <div className="flex items-start justify-between mb-2">
                        <span className="text-yellow-500 font-bold text-sm">Go Pro</span>
                    </div>
                    <p className="text-xs text-yellow-200/80 mb-3">Unlock new features, more song credits, better models, and more!</p>
                    <Button size="sm" className="w-full bg-neutral-200 hover:bg-white text-black border-0">
                        Upgrade
                    </Button>
                </div>

                <div className="flex gap-4 text-xs text-neutral-500 px-2 pb-4">
                    <Link href="#" className="hover:text-neutral-300">Labs</Link>
                    <Link href="#" className="hover:text-neutral-300">More</Link>
                </div>
            </div>
        </div>
    );
}
