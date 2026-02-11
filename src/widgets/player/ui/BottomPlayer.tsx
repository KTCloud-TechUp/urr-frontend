import { PlayerControls } from "@/features/player/ui/PlayerControls";
import { Button } from "@/shared/ui/Button";
import { Heart, Maximize2, Mic2, ListMusic, Volume2 } from "lucide-react";
import Image from "next/image";

export function BottomPlayer() {
    return (
        <div className="h-20 bg-black/95 border-t border-neutral-900 flex items-center justify-between px-4 fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg">

            {/* Current Song Info */}
            <div className="flex items-center gap-4 w-1/3">
                <div className="relative h-12 w-12 rounded bg-neutral-800 overflow-hidden">
                    <Image
                        src="https://picsum.photos/seed/current/200"
                        alt="Current Song"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="hidden sm:block">
                    <div className="text-sm font-medium text-white hover:underline cursor-pointer">붓끝에 맺힌 내 마음</div>
                    <div className="text-xs text-neutral-400 hover:underline cursor-pointer">test</div>
                </div>
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white ml-2">
                    <Heart className="h-5 w-5" />
                </Button>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center justify-center w-1/3">
                <PlayerControls />
                {/* Progress Bar (Visual Only) */}
                <div className="w-full max-w-md h-1 bg-neutral-800 rounded-full mt-2 relative group cursor-pointer">
                    <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-white rounded-full group-hover:bg-brand-500"></div>
                    <div className="absolute left-1/3 top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
                </div>
            </div>

            {/* Extra Actions */}
            <div className="flex items-center justify-end gap-2 w-1/3">
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hidden sm:inline-flex">
                    <Mic2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hidden sm:inline-flex">
                    <ListMusic className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2 group mx-2">
                    <Volume2 className="h-5 w-5 text-neutral-400 group-hover:text-white" />
                    <div className="w-20 h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-neutral-400 group-hover:bg-white"></div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                    <Maximize2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
