import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";
import { BottomPlayer } from "@/widgets/player/ui/BottomPlayer";
import { CreationPanel } from "@/widgets/creation-panel/ui/CreationPanel";
import { SongCard } from "@/features/song/ui/SongCard"; // Used, but SongList handles list logic
import { Button } from "@/shared/ui/Button"; // Used for Create button in main area
import { Input } from "@/shared/ui/Input";
import { Search, Filter, List, MoreHorizontal } from "lucide-react";

// Mock Data
const SONGS = [
    { id: 1, title: "즐거운 노래", author: "test", coverParams: "fun", tags: ["v5 Preview"], version: "v5 Preview", duration: "" },
    { id: 2, title: "Happy Vibration", author: "test", coverParams: "happy", tags: ["v5 Preview"], version: "v5 Preview", duration: "" },
    { id: 3, title: "Neon Lights", author: "test", coverParams: "neon", tags: ["v4.5-all"], version: "v4.5-all", duration: "" },
    { id: 4, title: "Quiet Night", author: "test", coverParams: "night", tags: ["v4.5-all"], version: "v4.5-all", duration: "" },
    { id: 5, title: "마음", author: "Create an emotional and cinematic vocal track in Korean, Lyrics convey Zhuge Liang (제갈량)...", coverParams: "mind", tags: ["v4.5-all"], version: "v4.5-all", duration: "3:20" },
    { id: 6, title: "꿈속의 여행", author: "Cinematic, Ambient, Dreamy pop...", coverParams: "dream", tags: ["v4.5-all"], version: "v4.5-all", duration: "2:48" },
    { id: 7, title: "마음속 다짐", author: "Create an emotional and cinematic vocal track in Korean...", coverParams: "mind2", tags: ["v5 Preview"], version: "v5 Preview", duration: "1:15" },
];

export default function TicketingPage() {
    return (
        <div className="min-h-screen bg-black text-neutral-50 flex font-sans">
            {/* Sidebar - Hidden on mobile, visible on md+ */}
            <Sidebar className="hidden md:flex flex-shrink-0" />

            {/* Creation Panel - Hidden on mobile/tablet, visible on lg+ */}
            <div className="hidden lg:flex">
                <CreationPanel />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative h-screen overflow-hidden">

                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-neutral-900 z-10 bg-black/50 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <span>Workspaces</span>
                        <span>{">"}</span>
                        <span className="text-white">My Workspace</span>
                    </div>

                    <div className="flex items-center gap-4 flex-1 justify-end max-w-3xl ml-auto">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                            <Input
                                placeholder="Search"
                                className="pl-10 h-9 bg-neutral-900 border-neutral-800 rounded-full focus:ring-1 focus:ring-neutral-700 text-sm placeholder:text-neutral-600"
                            />
                        </div>

                        {/* Filters */}
                        <Button variant="ghost" className="hidden sm:flex gap-2 text-neutral-400 hover:text-white rounded-full">
                            <Filter className="h-4 w-4" />
                            Filters (3)
                        </Button>

                        {/* Toggles */}
                        <div className="hidden xl:flex items-center bg-neutral-900 rounded-full p-1 border border-neutral-800">
                            <Button variant="ghost" size="sm" className="rounded-full h-7 px-3 bg-neutral-800 text-white text-xs">Newest</Button>
                            <Button variant="ghost" size="sm" className="rounded-full h-7 px-3 text-neutral-500 hover:text-white hover:bg-neutral-800 text-xs">Liked</Button>
                            <Button variant="ghost" size="sm" className="rounded-full h-7 px-3 text-neutral-500 hover:text-white hover:bg-neutral-800 text-xs">Public</Button>
                            <Button variant="ghost" size="sm" className="rounded-full h-7 px-3 text-neutral-500 hover:text-white hover:bg-neutral-800 text-xs">Uploads</Button>
                        </div>
                    </div>
                </header>

                {/* Scrollable List Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 scrollbar-hide">
                    <div className="space-y-1">
                        {SONGS.map((song) => (
                            <div key={song.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-neutral-900/40 transition-colors border border-transparent hover:border-neutral-800/50">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    {/* Song Card Component Usage */}
                                    <SongCard {...song} />
                                </div>

                                {/* Right Actions (Desktop) */}
                                <div className="hidden lg:flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" className="rounded-full bg-neutral-100 hover:bg-white text-black font-semibold h-8 text-xs border-0">
                                        Upgrade for full song
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white rounded-full hover:bg-neutral-800">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <BottomPlayer />
            </div>
        </div>
    );
}
