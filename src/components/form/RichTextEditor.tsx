import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "link"],
        [{ align: [] }],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list",
    "blockquote", "link",
    "align",
];

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
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
}
