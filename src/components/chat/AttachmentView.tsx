import { useEffect, useState } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import { Attachment, fetchAttachmentBlobUrl } from "../../services/messages/messages";

export default function AttachmentView({ attachment }: { attachment: Attachment }) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        let created: string | null = null;
        let active = true;
        fetchAttachmentBlobUrl(attachment.url)
            .then((u) => {
                created = u;
                if (active) setBlobUrl(u);
            })
            .catch(() => { /* ignore */ });
        return () => {
            active = false;
            if (created) URL.revokeObjectURL(created);
        };
    }, [attachment.url]);

    const download = () => {
        if (!blobUrl) return;
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = attachment.original_filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    if (attachment.is_image) {
        return blobUrl ? (
            <a href={blobUrl} target="_blank" rel="noreferrer" className="block">
                <img
                    src={blobUrl}
                    alt={attachment.original_filename}
                    className="max-h-52 max-w-[240px] rounded-lg border border-black/5 object-cover"
                />
            </a>
        ) : (
            <div className="h-32 w-44 animate-pulse rounded-lg bg-black/5 dark:bg-white/5" />
        );
    }

    return (
        <button
            onClick={download}
            disabled={!blobUrl}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
            <InsertDriveFileIcon fontSize="small" className="text-brand-600" />
            <span className="max-w-[170px] truncate text-gray-700 dark:text-gray-200">{attachment.original_filename}</span>
            <DownloadIcon fontSize="small" className="text-gray-400" />
        </button>
    );
}
