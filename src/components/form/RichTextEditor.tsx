import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

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
            ["table"],
            ["clean"],
        ],
        handlers: {
            // Insert a 3×3 table. `this` is the Quill toolbar at call time.
            table: function (this: { quill: { getModule: (name: string) => { insertTable: (r: number, c: number) => void } | undefined } }) {
                const tableModule = this.quill.getModule("table");
                if (tableModule) tableModule.insertTable(3, 3);
            },
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
