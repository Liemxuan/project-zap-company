import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '../../../../genesis/molecules/scroll-area';
import { Avatar, AvatarFallback } from '../../../../genesis/atoms/interactive/avatar';
import { PromptInputBox } from '../../../../genesis/molecules/ai-prompt-box';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: string;
}

export interface ChatInterfaceProps {
    messages: ChatMessage[];
    className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    className = ''
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={`flex flex-col h-full w-full max-w-4xl mx-auto rounded-lg border border-border bg-background overflow-hidden ${className}`}>

            {/* Header */}
            <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-state-success)] animate-pulse" />
                    <h2 className="text-sm font-semibold tracking-tight text-foreground">ZAP Gateway Session</h2>
                </div>
                <div className="text-xs text-muted-foreground font-dev text-transform-tertiary bg-black/5 px-2 py-1 rounded">PORT:3301</div>
            </div>

            {/* Message Stream */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto pb-4">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-[40vh] opacity-50">
                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center mb-4">
                                <span className="text-muted-foreground text-xs font-dev text-transform-tertiary">EOF</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Log initialized. Awaiting input.</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex w-full gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role !== 'user' && (
                                    <Avatar className="w-8 h-8 rounded-md mt-0.5 shadow-sm border border-border">
                                        <AvatarFallback className="bg-primary text-primary-foreground font-dev text-transform-tertiary text-xs rounded-md">Z</AvatarFallback>
                                    </Avatar>
                                )}

                                <div
                                    className={`relative flex flex-col max-w-[85%] ${msg.role === 'user'
                                        ? 'items-end'
                                        : 'items-start'
                                        }`}
                                >
                                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-wider">
                                        {msg.role} {msg.timestamp && `<${msg.timestamp}>`}
                                    </p>
                                    <div
                                        className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                            : 'bg-muted text-foreground border border-border shadow-sm rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>

                                {msg.role === 'user' && (
                                    <Avatar className="w-8 h-8 rounded-md mt-0.5 shadow-sm border border-border">
                                        <AvatarFallback className="bg-black text-white font-dev text-transform-tertiary text-xs rounded-md">U</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            {/* Input Box Footer */}
            <div className="p-4 bg-background border-t border-border">
                <PromptInputBox />
                <p className="text-center text-[10px] text-muted-foreground mt-3 font-medium uppercase tracking-widest">
                    Transmissions secured via OpenClaw Gateway
                </p>
            </div>

        </div>
    );
};
