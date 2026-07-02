import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import AttachmentView from "./AttachmentView";
import { ChatMessage } from "../../services/messages/messages";

interface ChatWindowProps {
    messages: ChatMessage[];
    // whose side is viewing — their own messages appear on the right
    viewerSide: "user" | "admin";
    onSend: (body: string, files: File[]) => Promise<void>;
    loading?: boolean;
    emptyHint?: string;
}

function time(value: string | null) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("az-AZ", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({ messages, viewerSide, onSend, loading, emptyHint }: ChatWindowProps) {
    const [body, setBody] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [sending, setSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    const pickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        e.target.value = "";
    };

    const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

    const handleSend = async () => {
        if (!body.trim() && files.length === 0) return;
        try {
            setSending(true);
            await onSend(body.trim(), files);
            setBody("");
            setFiles([]);
        } catch (error) {
            console.error("Failed to send message:", error);
            Swal.fire("Xəta!", "Mesaj göndərilə bilmədi.", "error");
        } finally {
            setSending(false);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40">
            {/* messages */}
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar p-4">
                {loading ? (
                    <div className="flex h-full items-center justify-center"><CircularProgress /></div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        {emptyHint || "Hələ mesaj yoxdur. İlk mesajı yazın."}
                    </div>
                ) : (
                    messages.map((m) => {
                        const mine = m.sender_type === viewerSide;
                        return (
                            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 shadow-theme-xs ${mine
                                    ? "bg-gradient-to-br from-brand-500 to-purple-500 text-white"
                                    : "bg-white text-gray-800 border border-gray-100 dark:bg-white/[0.06] dark:text-gray-100 dark:border-white/10"}`}>
                                    {m.body && <p className="whitespace-pre-line break-words text-sm">{m.body}</p>}
                                    {m.attachments.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {m.attachments.map((a) => <AttachmentView key={a.id} attachment={a} />)}
                                        </div>
                                    )}
                                    <div className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-gray-400"}`}>
                                        {time(m.created_at)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={endRef} />
            </div>

            {/* selected file chips */}
            {files.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-2 dark:border-white/[0.06]">
                    {files.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-white/10 dark:text-gray-200">
                            {f.name.length > 24 ? f.name.slice(0, 24) + "…" : f.name}
                            <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-error-500">
                                <CloseIcon style={{ width: 14, height: 14 }} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* composer */}
            <div className="flex items-end gap-2 border-t border-gray-100 p-3 dark:border-white/[0.06]">
                <input ref={fileInputRef} type="file" multiple hidden onChange={pickFiles} />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Fayl əlavə et"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                >
                    <AttachFileIcon fontSize="small" />
                </button>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={1}
                    placeholder="Mesaj yazın..."
                    className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl border border-gray-200 bg-white/80 px-3.5 py-2.5 text-sm text-gray-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15 dark:border-white/10 dark:bg-gray-900/60 dark:text-white/90"
                />
                <button
                    onClick={handleSend}
                    disabled={sending || (!body.trim() && files.length === 0)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-theme-sm transition-opacity disabled:opacity-50"
                >
                    {sending ? <CircularProgress size={16} style={{ color: "#fff" }} /> : <SendIcon fontSize="small" />}
                </button>
            </div>
        </div>
    );
}
