import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCommentIcon from "@mui/icons-material/AddComment";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { Modal } from "../ui/modal";
import apiClient from "../../util/apiClient";
import { useModal } from "../../hooks/useModal";
import ChatWindow from "./ChatWindow";
import {
    ChatMessage,
    ThreadListItem,
    getThreads,
    getThreadByUser,
    sendMessageAsAdmin,
} from "../../services/messages/messages";

type Party = { name: string | null; surname: string | null; email: string | null };
type Selected = { user_fin_kod: string; user: Party } | null;

function fullName(u: Party | undefined) {
    const n = `${u?.name ?? ""} ${u?.surname ?? ""}`.trim();
    return n || "Naməlum istifadəçi";
}

export default function AdminInbox() {
    const [threads, setThreads] = useState<ThreadListItem[]>([]);
    const [loadingThreads, setLoadingThreads] = useState(true);
    const [selected, setSelected] = useState<Selected>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingThread, setLoadingThread] = useState(false);

    // new-chat picker
    const { isOpen, openModal, closeModal } = useModal();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

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

    const openConversation = async (user_fin_kod: string, user: Party) => {
        setSelected({ user_fin_kod, user });
        setLoadingThread(true);
        try {
            const thread = await getThreadByUser(user_fin_kod);
            setMessages(thread.messages);
            setThreads((prev) => prev.map((x) => (x.user_fin_kod === user_fin_kod ? { ...x, unread: 0 } : x)));
        } catch (error) {
            console.error("Failed to open thread:", error);
            setMessages([]);
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

    const searchUsers = async (q: string) => {
        setQuery(q);
        if (!q.trim()) {
            setResults([]);
            return;
        }
        setSearching(true);
        try {
            const isFin = /^\d+$/.test(q.trim());
            const params = isFin ? { finKod: q.trim() } : { name: q.trim() };
            const res = await apiClient.get("/api/users/all", { params });
            // Chat is admin <-> leads (project owners, role 0) only.
            const leads = (res.data?.data ?? []).filter((u: any) => u.project_role === 0);
            setResults(leads);
        } catch {
            setResults([]);
        } finally {
            setSearching(false);
        }
    };

    const startChatWith = (u: any) => {
        closeModal();
        setQuery("");
        setResults([]);
        openConversation(u.fin_kod, { name: u.name, surname: u.surname, email: u.personal_email || u.work_email });
        loadThreads();
    };

    return (
        <>
            <div className="flex h-[calc(100vh-220px)] min-h-[460px] gap-4">
                {/* thread list */}
                <div className={`${selected ? "hidden md:flex" : "flex"} w-full md:w-80 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40`}>
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/[0.06]">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Söhbətlər</span>
                        <button
                            onClick={openModal}
                            title="Yeni söhbət"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-300"
                        >
                            <AddCommentIcon fontSize="small" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loadingThreads ? (
                            <div className="flex h-full items-center justify-center"><CircularProgress /></div>
                        ) : threads.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-gray-400">Söhbət yoxdur. "Yeni söhbət" ilə başlayın.</div>
                        ) : (
                            threads.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => openConversation(t.user_fin_kod, t.user)}
                                    className={`flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-white/[0.04] dark:hover:bg-white/[0.03] ${selected?.user_fin_kod === t.user_fin_kod ? "bg-brand-50/50 dark:bg-brand-500/[0.08]" : ""}`}
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
                        <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400 dark:border-white/10">
                            <span>Söhbət seçin və ya yeni söhbət başladın</span>
                            <button onClick={openModal} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600">
                                <AddCommentIcon fontSize="small" /> Yeni söhbət
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* new-chat user picker */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[560px] m-4">
                <div className="relative w-full p-4 bg-white rounded-3xl dark:bg-gray-900 lg:p-8">
                    <h4 className="mb-1 text-xl font-semibold text-gray-800 dark:text-white/90">Yeni söhbət</h4>
                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">İstifadəçini ad və ya FIN üzrə axtarın.</p>
                    <div className="relative mb-4">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => searchUsers(e.target.value)}
                            placeholder="Ad və ya FIN..."
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15 dark:border-white/10 dark:bg-gray-900/60 dark:text-white/90"
                        />
                    </div>
                    <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
                        {searching ? (
                            <div className="flex justify-center py-6"><CircularProgress size={22} /></div>
                        ) : query && results.length === 0 ? (
                            <p className="py-6 text-center text-sm text-gray-400">Nəticə tapılmadı</p>
                        ) : (
                            results.map((u) => (
                                <button
                                    key={u.fin_kod}
                                    onClick={() => startChatWith(u)}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-xs font-bold text-white">
                                        {(u.name?.[0] || u.fin_kod?.[0] || "?").toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">{`${u.name ?? ""} ${u.surname ?? ""}`.trim() || "Naməlum"}</p>
                                        <p className="truncate text-xs text-gray-400">{u.fin_kod}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}
