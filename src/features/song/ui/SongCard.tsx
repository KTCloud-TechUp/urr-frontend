import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { Play, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface SongProps {
    title: string;
    author: string;
    coverParams: string; // Using placeholder image params for now
    tags?: string[];
    version?: string;
    duration?: string;
}

export function SongCard({ title, author, coverParams, tags = [], version, duration }: SongProps) {
    return (
        <div className="group relative flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-neutral-900 transition-colors">
            {/* Cover Image */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-neutral-800">
                <Image
                    src={`https://picsum.photos/seed/${coverParams}/200`}
                    alt={title}
                    fill
                    className="object-cover"
                />
                {/* Hover Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-6 w-6 text-white fill-white" />
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-neutral-200 truncate">{title}</h3>
                    {version && <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{version}</Badge>}
                </div>
                <p className="text-sm text-neutral-400 truncate w-full">{author}</p>
            </div>

            {/* Duration */}
            <div className="text-sm text-neutral-500 font-mono hidden sm:block">
                {duration || "0:00"}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white">
                    <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white">
                    <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            {/* Mobile Actions Placeholder / Menu Trigger */}
            <div className="sm:hidden opacity-100 group-hover:opacity-0 absolute right-2">
                <MoreHorizontal className="h-5 w-5 text-neutral-500" />
            </div>
        </div>
    );
}
