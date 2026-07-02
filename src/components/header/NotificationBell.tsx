import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../ui/dropdown/Dropdown";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
    AppNotification,
    getNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
} from "../../services/notification/notification";

function timeAgo(value: string | null): string {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("az-AZ", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function NotificationBell() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [unread, setUnread] = useState(0);
    const [items, setItems] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshCount = async () => {
        try {
            setUnread(await getUnreadCount());
        } catch {
            /* ignore transient errors */
        }
    };

    useEffect(() => {
        refreshCount();
        const interval = setInterval(refreshCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggle = async () => {
        const next = !open;
        setOpen(next);
        if (next) {
            setLoading(true);
            try {
                setItems(await getNotifications());
            } catch {
                setItems([]);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClick = async (n: AppNotification) => {
        try {
            if (!n.is_read) {
                await markNotificationRead(n.id);
                setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
                setUnread((c) => Math.max(0, c - 1));
            }
        } catch {
            /* ignore */
        }
        setOpen(false);
        if (n.link) navigate(n.link);
    };

    const handleMarkAll = async () => {
        try {
            await markAllNotificationsRead();
            setItems((prev) => prev.map((x) => ({ ...x, is_read: true })));
            setUnread(0);
        } catch {
            /* ignore */
        }
    };

    return (
        <div className="relative">
            <button
                onClick={toggle}
                className="dropdown-toggle relative flex items-center justify-center w-11 h-11 text-gray-500 bg-white/60 hover:bg-white dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-gray-200/70 rounded-xl dark:border-white/[0.06] dark:text-gray-300 transition-all"
                aria-label="Bildirişlər"
            >
                <NotificationsNoneIcon style={{ width: 22, height: 22 }} />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-bold text-white">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </button>

            <Dropdown isOpen={open} onClose={() => setOpen(false)} className="w-[340px] max-w-[calc(100vw-2rem)] p-0">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/[0.06]">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white/90">Bildirişlər</span>
                    {items.some((i) => !i.is_read) && (
                        <button onClick={handleMarkAll} className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
                            Hamısını oxu
                        </button>
                    )}
                </div>
                <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-400">Yüklənir...</div>
                    ) : items.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-gray-400">Bildiriş yoxdur</div>
                    ) : (
                        items.map((n) => (
                            <button
                                key={n.id}
                                onClick={() => handleClick(n)}
                                className={`flex w-full flex-col items-start gap-0.5 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-white/[0.04] dark:hover:bg-white/[0.03] ${n.is_read ? "" : "bg-brand-50/40 dark:bg-brand-500/[0.06]"}`}
                            >
                                <div className="flex w-full items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{n.title}</span>
                                    {!n.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                                </div>
                                {n.body && <span className="text-xs text-gray-500 dark:text-gray-400">{n.body}</span>}
                                <span className="text-[10px] text-gray-400">{timeAgo(n.created_at)}</span>
                            </button>
                        ))
                    )}
                </div>
            </Dropdown>
        </div>
    );
}
