import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

type TableModule = {
    insertTable: (rows: number, cols: number) => void;
    insertRowBelow: () => void;
    insertColumnRight: () => void;
    deleteRow: () => void;
    deleteColumn: () => void;
    deleteTable: () => void;
};
type ToolbarThis = { quill: { getModule: (name: string) => TableModule | undefined } };

const modules = {
    // Quill 2's built-in table module.
    table: true,
    toolbar: {
        container: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "link"],
            [{ align: [] }],
            ["table", "table-add-row", "table-add-column", "table-delete-row", "table-delete-column", "table-delete"],
            ["clean"],
        ],
        handlers: {
            // `this` is the Quill toolbar; operations act on the focused cell.
            table: function (this: ToolbarThis) { this.quill.getModule("table")?.insertTable(3, 3); },
            "table-add-row": function (this: ToolbarThis) { this.quill.getModule("table")?.insertRowBelow(); },
            "table-add-column": function (this: ToolbarThis) { this.quill.getModule("table")?.insertColumnRight(); },
            "table-delete-row": function (this: ToolbarThis) { this.quill.getModule("table")?.deleteRow(); },
            "table-delete-column": function (this: ToolbarThis) { this.quill.getModule("table")?.deleteColumn(); },
            "table-delete": function (this: ToolbarThis) { this.quill.getModule("table")?.deleteTable(); },
        },
    },
};

// No `formats` restriction so table blots (and their cells) are preserved;
// the backend (bleach) is the source of truth for what HTML is allowed.

// Quill represents an empty document as "<p><br></p>"; normalize that to "".
const isEmptyHtml = (html: string) =>
    html.replace(/<(.|\n)*?>/g, "").trim().length === 0;

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={(html) => onChange(isEmptyHtml(html) ? "" : html)}
                modules={modules}
                placeholder={placeholder}
            />
        </div>
    );
}
