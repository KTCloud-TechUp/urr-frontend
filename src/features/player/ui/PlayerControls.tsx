import { Button } from "@/shared/ui/Button";
import { Play, SkipBack, SkipForward, Repeat, Shuffle } from "lucide-react";

export function PlayerControls() {
    return (
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hidden sm:inline-flex">
                <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-200 hover:text-white">
                <SkipBack className="h-5 w-5 fill-current" />
            </Button>
            <div className="h-10 w-10 bg-neutral-200 rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                <Play className="h-5 w-5 text-neutral-900 fill-current ml-0.5" />
            </div>
            <Button variant="ghost" size="icon" className="text-neutral-200 hover:text-white">
                <SkipForward className="h-5 w-5 fill-current" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hidden sm:inline-flex">
                <Repeat className="h-4 w-4" />
            </Button>
        </div>
    );
}
