import { CSSProperties, useEffect, useRef, useState } from "react";

interface ReadMoreProps {
    text?: string | null;
    /** Number of lines shown when collapsed. */
    lines?: number;
    className?: string;
    /** Label overrides (Azerbaijani by default). */
    moreLabel?: string;
    lessLabel?: string;
}

/**
 * Clamps long text to `lines` and reveals a "Daha çox" / "Az göstər" toggle
 * only when the content actually overflows. Keeps tables compact and readable.
 */
export default function ReadMore({
    text,
    lines = 2,
    className = "",
    moreLabel = "Daha çox",
    lessLabel = "Az göstər",
}: ReadMoreProps) {
    const ref = useRef<HTMLParagraphElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setOverflowing] = useState(false);

    const content = (text ?? "").trim();

    useEffect(() => {
        const el = ref.current;
        if (!el || expanded) return;
        setOverflowing(el.scrollHeight > el.clientHeight + 1);
    }, [content, lines, expanded]);

    if (!content) {
        return <span className="text-gray-400">—</span>;
    }

    const clampStyle: CSSProperties | undefined = expanded
        ? undefined
        : {
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: lines,
              overflow: "hidden",
          };

    return (
        <div className={className}>
            <p ref={ref} className="whitespace-pre-line break-words" style={clampStyle}>
                {content}
            </p>
            {(overflowing || expanded) && (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                    {expanded ? lessLabel : moreLabel}
                </button>
            )}
        </div>
    );
}
