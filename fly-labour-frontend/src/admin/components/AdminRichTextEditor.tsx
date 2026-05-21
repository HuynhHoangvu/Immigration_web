import { useCallback, useRef, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Image as ImageIcon,
  Table2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Heading2,
  Heading3,
  Pilcrow,
  Highlighter,
  Palette,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { uploadApi } from "@core/services/api";
import clsx from "clsx";
import s from "./AdminRichTextEditor.module.scss";

/** Legacy plain-text bài cũ → HTML hợp lệ cho TipTap */
function coerceEditorHtml(input: string): string {
  const raw = (input || "").trim();
  if (!raw) return "<p></p>";
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
  const blocks = raw.split(/\n{2,}/);
  const html = blocks
    .map((block) => {
      const inner = block.split("\n").join("<br />");
      return `<p>${inner}</p>`;
    })
    .join("");
  return html || "<p></p>";
}

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        s.toolbarBtn,
        active && s.toolbarBtnActive,
        disabled && s.toolbarBtnDisabled,
      )}
    >
      {children}
    </button>
  );
}

export default function AdminRichTextEditor({
  value,
  onChange,
  placeholder = "Soạn nội dung…",
  className,
}: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "admin-rte-link",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "admin-rte-image",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "admin-rte-table",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
    ],
    content: coerceEditorHtml(value),
    editorProps: {
      attributes: {
        class: "admin-tiptap-editor prose max-w-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Địa chỉ liên kết (URL):", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertImageFromUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL ảnh:", "https://");
    if (!url?.trim()) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  }, [editor]);

  const onImageFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !editor) return;
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Ảnh tối đa 8MB");
        return;
      }
      if (uploadingRef.current) return;
      uploadingRef.current = true;
      const t = toast.loading("Đang tải ảnh…");
      try {
        const { url } = await uploadApi.image(file);
        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Đã chèn ảnh", { id: t });
      } catch {
        toast.error("Tải ảnh thất bại — kiểm tra đăng nhập admin", { id: t });
      } finally {
        uploadingRef.current = false;
      }
    },
    [editor],
  );

  const insertTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  if (!editor) {
    return (
      <div className={s.loadingWrap}>
        <Loader2 className={s.loadingSpinner} aria-hidden />
        <span className={s.loadingText}>Đang mở trình soạn thảo…</span>
      </div>
    );
  }

  return (
    <div className={clsx(s.root, className)}>
      <div className={s.toolbar}>
        <ToolbarButton
          title="Hoàn tác"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Làm lại"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo2 size={18} />
        </ToolbarButton>
        <span className={s.toolbarDivider} />
        <ToolbarButton
          title="Tiêu đề 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Tiêu đề 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Đoạn văn"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow size={18} />
        </ToolbarButton>
        <span className={s.toolbarDivider} />
        <ToolbarButton
          title="Đậm"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Nghiêng"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Gạch chân"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Gạch ngang"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={18} />
        </ToolbarButton>
        <span className={s.toolbarDivider} />
        <ToolbarButton
          title="Danh sách bullet"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Danh sách số"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Trích dẫn"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Đường kẻ ngang"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={18} />
        </ToolbarButton>
        <span className={s.toolbarDivider} />
        <ToolbarButton
          title="Căn trái"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Căn giữa"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Căn phải"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={18} />
        </ToolbarButton>
        <span className={s.toolbarDivider} />
        <ToolbarButton title="Liên kết" onClick={setLink}>
          <Link2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Chèn ảnh (tải lên)"
          onClick={() => imageInputRef.current?.click()}
        >
          <ImageIcon size={18} />
        </ToolbarButton>
        <ToolbarButton title="Chèn ảnh từ URL" onClick={insertImageFromUrl}>
          <span className={s.toolbarUrlLabel}>URL</span>
        </ToolbarButton>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={s.fileInput}
          onChange={onImageFile}
        />
        <ToolbarButton title="Chèn bảng 3×3" onClick={insertTable}>
          <Table2 size={18} />
        </ToolbarButton>
        <span className={s.toolbarDivider} />
        <ToolbarButton
          title="Màu chữ"
          onClick={() => colorInputRef.current?.click()}
        >
          <Palette size={18} />
        </ToolbarButton>
        <input
          ref={colorInputRef}
          type="color"
          className="sr-only"
          aria-hidden
          defaultValue="#1e293b"
          onChange={(e) => {
            editor.chain().focus().setColor(e.target.value).run();
          }}
        />
        <ToolbarButton
          title="Tô nền (highlight)"
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter size={18} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
