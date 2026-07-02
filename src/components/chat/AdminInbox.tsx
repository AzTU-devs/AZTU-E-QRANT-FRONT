import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import ChatWindow from "./ChatWindow";
import {
    ChatMessage,
    ThreadListItem,
    getThreads,
    getThreadByUser,
    sendMessageAsAdmin,
} from "../../services/messages/messages";

function fullName(u: ThreadListItem["user"]) {
    const n = `${u?.name ?? ""} ${u?.surname ?? ""}`.trim();
    return n || "Naməlum istifadəçi";
}

export default function AdminInbox() {
    const [threads, setThreads] = useState<ThreadListItem[]>([]);
    const [loadingThreads, setLoadingThreads] = useState(true);
    const [selected, setSelected] = useState<ThreadListItem | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingThread, setLoadingThread] = useState(false);

    const loadThreads = async () => {
        try {
            setThreads(await getThreads());
        } catch (error) {
            console.error("Failed to load threads:", error);
        } finally {
            setLoadingThreads(false);
        }
    };

    useEffect(() => {
        loadThreads();
    }, []);

    const openThread = async (t: ThreadListItem) => {
        setSelected(t);
        setLoadingThread(true);
        try {
            const thread = await getThreadByUser(t.user_fin_kod);
            setMessages(thread.messages);
            // clear unread badge locally + refresh list
            setThreads((prev) => prev.map((x) => (x.id === t.id ? { ...x, unread: 0 } : x)));
        } catch (error) {
            console.error("Failed to open thread:", error);
        } finally {
            setLoadingThread(false);
        }
    };

    const handleSend = async (body: string, files: File[]) => {
        if (!selected) return;
        await sendMessageAsAdmin(selected.user_fin_kod, body, files);
        const thread = await getThreadByUser(selected.user_fin_kod);
        setMessages(thread.messages);
        loadThreads();
    };

    return (
        <div className="flex h-[calc(100vh-220px)] min-h-[460px] gap-4">
            {/* thread list */}
            <div className={`${selected ? "hidden md:flex" : "flex"} w-full md:w-80 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40`}>
                <div className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-white/[0.06] dark:text-gray-200">
                    Söhbətlər
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loadingThreads ? (
                        <div className="flex h-full items-center justify-center"><CircularProgress /></div>
                    ) : threads.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-gray-400">Söhbət yoxdur</div>
                    ) : (
                        threads.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => openThread(t)}
                                className={`flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-white/[0.04] dark:hover:bg-white/[0.03] ${selected?.id === t.id ? "bg-brand-50/50 dark:bg-brand-500/[0.08]" : ""}`}
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-sm font-bold text-white">
                                    {(t.user?.name?.[0] || t.user_fin_kod[0] || "?").toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">{fullName(t.user)}</span>
                                        {t.unread > 0 && (
                                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-bold text-white">{t.unread}</span>
                                        )}
                                    </div>
                                    <span className="block truncate text-xs text-gray-400">{t.last_preview || "—"}</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* conversation */}
            <div className={`${selected ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col`}>
                {selected ? (
                    <>
                        <div className="mb-2 flex items-center gap-2">
                            <button onClick={() => setSelected(null)} className="md:hidden rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10">
                                <ArrowBackIcon fontSize="small" />
                            </button>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{fullName(selected.user)}</span>
                            <span className="text-xs text-gray-400">({selected.user_fin_kod})</span>
                        </div>
                        <div className="min-h-0 flex-1">
                            <ChatWindow messages={messages} viewerSide="admin" onSend={handleSend} loading={loadingThread} />
                        </div>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400 dark:border-white/10">
                        Söhbət seçin
                    </div>
                )}
            </div>
        </div>
    );
}
