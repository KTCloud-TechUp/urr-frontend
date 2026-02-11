import { SongCard } from "@/features/song/ui/SongCard";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Search, Filter, SlidersHorizontal, Grid, List, MoreHorizontal } from "lucide-react";
import { Badge } from "@/shared/ui/Badge";

const SONGS = [
    { id: 1, title: "즐거운 노래 만들어줘", author: "test", coverParams: "fun", tags: ["v5 Preview"], version: "v5 Preview", duration: "" },
    { id: 2, title: "Happy Vibration", author: "test", coverParams: "happy", tags: ["v5 Preview"], version: "v5 Preview", duration: "" },
    { id: 3, title: "Neon Lights", author: "test", coverParams: "neon", tags: ["v4.5-all"], version: "v4.5-all", duration: "" },
    { id: 4, title: "Quiet Night", author: "test", coverParams: "night", tags: ["v4.5-all"], version: "v4.5-all", duration: "" },
    { id: 5, title: "붓끝에 맺힌 내 마음", author: "Create an emotional and cinematic vocal track in Korean, Lyrics convey Zhuge Liang (제갈량)...", coverParams: "mind", tags: ["v4.5-all"], version: "v4.5-all", duration: "3:20" },
    { id: 6, title: "꿈속의 여행", author: "Cinematic, Ambient, Dreamy pop...", coverParams: "dream", tags: ["v4.5-all"], version: "v4.5-all", duration: "2:48" },
    { id: 7, title: "붓끝에 맺힌 내 마음", author: "Create an emotional and cinematic vocal track in Korean...", coverParams: "mind2", tags: ["v5 Preview"], version: "v5 Preview", duration: "1:15" },
];

export function SongList() {
    return (
        <div className="flex-1 flex flex-col h-full bg-neutral-950">
            {/* Header / Search Area */}
            <div className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md p-6 border-b border-neutral-800">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-neutral-400 text-sm">Workspaces &gt; My Workspace</span>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                        <Input
                            placeholder="Search"
                            className="pl-10 bg-neutral-900 border-neutral-800 rounded-full focus:ring-brand-500"
                        />
                    </div>

                    <Button variant="secondary" className="gap-2 rounded-full">
                        <Filter className="h-4 w-4" />
                        Filters (3)
                    </Button>

                    <div className="flex items-center bg-neutral-900 rounded-full p-1 border border-neutral-800">
                        <Button variant="ghost" size="sm" className="rounded-full h-8 bg-neutral-800 text-white">Newest</Button>
                        <Button variant="ghost" size="sm" className="rounded-full h-8 text-neutral-400 hover:text-white">Liked</Button>
                        <Button variant="ghost" size="sm" className="rounded-full h-8 text-neutral-400 hover:text-white">Public</Button>
                        <Button variant="ghost" size="sm" className="rounded-full h-8 text-neutral-400 hover:text-white">Uploads</Button>
                    </div>

                    <div className="flex items-center gap-1 border-l border-neutral-800 pl-4">
                        <Button variant="ghost" size="icon" className="text-white"><List className="h-5 w-5" /></Button>
                    </div>
                </div>
            </div>

            {/* Song List Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-2">
                {SONGS.map((song) => (
                    <div key={song.id} className="group flex items-center gap-4 p-2 rounded-xl hover:bg-neutral-900/50">
                        <SongCard {...song} />
                        {/* Right Side Actions for List Item */}
                        <div className="ml-auto hidden md:flex items-center gap-4">
                            <Button size="sm" className="rounded-full bg-neutral-100 hover:bg-white text-black font-semibold h-8 text-xs">
                                Upgrade for full song
                            </Button>
                            <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
