import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ChatWindow from "../../components/chat/ChatWindow";
import { getMyThread, sendMessage, ChatMessage } from "../../services/messages/messages";

export default function MessagesPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const thread = await getMyThread();
            setMessages(thread.messages);
        } catch (error) {
            console.error("Failed to load thread:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSend = async (body: string, files: File[]) => {
        await sendMessage(body, files);
        await load();
    };

    return (
        <div>
            <PageMeta title="AzTU E-Qrant | Mesajlar" description="Admin ilə yazışma" />
            <PageBreadcrumb pageTitle="Mesajlar" />
            <div className="h-[calc(100vh-220px)] min-h-[440px]">
                <ChatWindow
                    messages={messages}
                    viewerSide="user"
                    onSend={handleSend}
                    loading={loading}
                    emptyHint="Admin ilə söhbətə başlayın."
                />
            </div>
        </div>
    );
}
