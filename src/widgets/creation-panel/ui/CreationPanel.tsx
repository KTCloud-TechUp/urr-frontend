"use client";

import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { Music, Mic, Upload, Sparkles, X, ChevronDown } from "lucide-react";
import { useState } from "react";

const INSPIRATION_TAGS = [
    "랩 보컬", "자기 성찰", "기분 좋은 분위기", "포스트 락", "시티팝",
    "재즈", "힙합", "어쿠스틱", "발라드", "R&B"
];

export function CreationPanel() {
    const [description, setDescription] = useState("즐거운 노래 만들어줘");

    return (
        <div className="w-[360px] bg-neutral-950 border-r border-neutral-900 flex flex-col h-full flex-shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-yellow-500 font-medium text-sm">
                        <Sparkles className="h-4 w-4 fill-current" />
                        <span>40</span>
                    </div>
                    <div className="bg-neutral-900 rounded-full p-0.5 flex text-xs font-medium border border-neutral-800">
                        <button className="px-3 py-1 rounded-full bg-neutral-800 text-white">Simple</button>
                        <button className="px-3 py-1 rounded-full text-neutral-400 hover:text-white">Custom</button>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-neutral-400">v4.5-all</span>
                    <ChevronDown className="h-3 w-3 text-neutral-400" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Song Description */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Song Description</label>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500 hover:text-white">
                            <Sparkles className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="relative">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-700 resize-none"
                            placeholder="Describe the song you want to create..."
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="secondary" className="flex-1 text-xs gap-2 h-9 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800">
                            + Audio
                        </Button>
                        <Button variant="secondary" className="flex-1 text-xs gap-2 h-9 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800">
                            + Lyrics
                        </Button>
                        <Button variant="ghost" className="flex-1 text-xs gap-2 h-9 text-neutral-500 hover:text-white">
                            <Music className="h-3 w-3" />
                            Instrumental
                        </Button>
                    </div>
                </div>

                {/* Inspiration */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Inspiration</label>
                    <div className="flex flex-wrap gap-2">
                        {INSPIRATION_TAGS.map((tag) => (
                            <button
                                key={tag}
                                className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white transition-colors flex items-center gap-1"
                            >
                                + {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-neutral-900 space-y-3">
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800">
                        <div className="h-4 w-4 border-2 border-neutral-500 rounded sm" /> {/* Trash icon placeholder */}
                    </Button>
                    <Button className="flex-1 h-10 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity">
                        <span className="mr-2">🎵</span> Create
                    </Button>
                </div>
            </div>
        </div>
    );
}
