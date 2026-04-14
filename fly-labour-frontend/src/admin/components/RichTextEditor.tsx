import React, { useRef, useCallback } from 'react';
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/core';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, List, ListOrdered, Quote,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link2, Image as ImageIcon, Table as TableIcon,
  Undo, Redo, Eraser, Highlighter, Palette,
  Grid, Trash2, Type,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadApi } from '../../core/services/api';

// ── Preset colors ─────────────────────────────────────────────────────────────
const PRESET_COLORS = [
  '#000000', '#1f2937', '#6b7280', '#9ca3af', '#d1d5db', '#ffffff',
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#ec4899', '#f43f5e', '#e4a808', '#ff9500', '#7c3aed', '#be123c',
];

// ── ColorPickerPopover ────────────────────────────────────────────────────────
function ColorPickerPopover({
  label,
  activeColor,
  onSelect,
  children,
}: {
  label: string;
  activeColor?: string;
  onSelect: (color: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [hex, setHex] = React.useState('');
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const apply = (color: string) => {
    onSelect(color);
    setOpen(false);
    setHex('');
  };

  const hexValid = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(hex);
  const previewColor = hexValid ? hex : (activeColor ?? '#000000');

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(v => !v)} className="cursor-pointer">{children}</div>
      {open && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-brand-card border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 w-[220px] animate-in fade-in slide-in-from-top-1 duration-150">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2.5">{label}</p>

          {/* Preset grid */}
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => apply(color)}
                style={{ backgroundColor: color }}
                title={color}
                className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 hover:shadow-md ${
                  activeColor === color
                    ? 'border-brand-gold scale-110 shadow-gold-sm'
                    : color === '#ffffff'
                    ? 'border-slate-200 dark:border-white/20'
                    : 'border-transparent'
                }`}
              />
            ))}
          </div>

          {/* Hex input */}
          <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-white/5">
            <div
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 flex-shrink-0"
              style={{ backgroundColor: previewColor }}
            />
            <input
              type="text"
              value={hex}
              onChange={e => setHex(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && hexValid) apply(hex); }}
              placeholder="#000000"
              maxLength={7}
              className="flex-1 px-2 py-1.5 text-xs font-mono bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:border-brand-gold"
            />
            <button
              type="button"
              onClick={() => { if (hexValid) apply(hex); }}
              disabled={!hexValid}
              className="px-2.5 py-1.5 text-xs font-bold bg-brand-gold text-amber-950 rounded-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Custom Image NodeView (resize + align + delete) ───────────────────────────
function ImageNodeView({ node, updateAttributes, selected, deleteNode }: NodeViewProps) {
  const { src, alt, title, width, align } = node.attrs as {
    src: string; alt?: string; title?: string;
    width?: string; align?: 'left' | 'center' | 'right';
  };

  const currentWidth = width ?? '100%';
  const currentAlign = align ?? 'left';

  const wrapperStyle: React.CSSProperties = {
    display: 'block',
    textAlign: currentAlign,
    margin: '1.5rem 0',
  };

  return (
    <NodeViewWrapper style={wrapperStyle} data-drag-handle>
      <div className="relative inline-block" style={{ maxWidth: '100%' }}>
        <img
          src={src}
          alt={alt ?? ''}
          title={title}
          draggable={false}
          style={{ width: currentWidth, height: 'auto', display: 'inline-block' }}
          className={`rounded-2xl shadow-md transition-all ${
            selected ? 'outline outline-[3px] outline-[#e4a808] outline-offset-2' : ''
          }`}
        />

        {/* Floating toolbar — shows when image is selected */}
        {selected && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 whitespace-nowrap">
            {/* Width */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-white/10">
              {(['25%', '50%', '75%', '100%'] as const).map(w => (
                <button
                  key={w}
                  type="button"
                  onClick={() => updateAttributes({ width: w })}
                  className={`px-2 py-1 text-[10px] font-black rounded-lg transition-colors ${
                    currentWidth === w
                      ? 'bg-brand-gold text-amber-950'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            {/* Align */}
            <div className="flex items-center gap-0.5 px-2 border-r border-white/10">
              {([
                { a: 'left' as const, Icon: AlignLeft },
                { a: 'center' as const, Icon: AlignCenter },
                { a: 'right' as const, Icon: AlignRight },
              ]).map(({ a, Icon }) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => updateAttributes({ align: a })}
                  className={`p-1.5 rounded-lg transition-colors ${
                    currentAlign === a
                      ? 'bg-brand-gold text-amber-950'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={13} />
                </button>
              ))}
            </div>
            {/* Delete */}
            <button
              type="button"
              onClick={deleteNode}
              className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

// Custom Image extension with width + align attributes + NodeView
const CustomImage = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: el => el.style.width || '100%',
        renderHTML: attrs => ({ style: `width:${attrs.width}` }),
      },
      align: {
        default: 'left',
        parseHTML: el => {
          const ta = el.style.textAlign;
          if (ta === 'center') return 'center';
          if (ta === 'right') return 'right';
          return 'left';
        },
        renderHTML: () => ({}), // handled by NodeView wrapper style
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

// ── Toolbar helpers ───────────────────────────────────────────────────────────
function ToolbarBtn({
  onClick, active = false, title, icon: Icon, disabled = false,
}: {
  onClick: () => void; active?: boolean; title: string;
  icon: React.ElementType; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors border ${
        active
          ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/30'
          : 'text-slate-600 dark:text-brand-muted border-transparent hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-200 dark:hover:border-white/10'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <Icon size={16} />
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-0.5 flex-shrink-0" />;
}

// ── Main component ────────────────────────────────────────────────────────────
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value, onChange, placeholder, className,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTableGrid, setShowTableGrid] = React.useState(false);
  const [hoverGrid, setHoverGrid] = React.useState({ r: 0, c: 0 });
  const rowsRef = useRef<HTMLInputElement>(null);
  const colsRef = useRef<HTMLInputElement>(null);
  const tableGridRef = useRef<HTMLDivElement>(null);

  // Close table grid on outside click
  React.useEffect(() => {
    if (!showTableGrid) return;
    const handler = (e: MouseEvent) => {
      if (tableGridRef.current && !tableGridRef.current.contains(e.target as Node)) {
        setShowTableGrid(false);
        setHoverGrid({ r: 0, c: 0 });
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showTableGrid]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      CustomImage,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-brand-gold underline' } }),
      Placeholder.configure({ placeholder: placeholder ?? 'Bắt đầu viết nội dung tại đây...' }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // ── Upload ──────────────────────────────────────────────────────────────────
  const uploadAndInsert = useCallback(async (file: File) => {
    if (!editor) return;
    const toastId = toast.loading('Đang tải ảnh lên...');
    try {
      const { url } = await uploadApi.image(file);
      editor.chain().focus().setImage({ src: url }).run();
      toast.success('Tải ảnh thành công!', { id: toastId });
    } catch {
      toast.error('Lỗi khi tải ảnh lên server!', { id: toastId });
    }
  }, [editor]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { uploadAndInsert(file); e.target.value = ''; }
  }, [uploadAndInsert]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    if (!editor) return;
    const imageItem = Array.from(e.clipboardData?.items ?? []).find(i => i.type.startsWith('image/'));
    if (!imageItem) return;
    e.preventDefault();
    const file = imageItem.getAsFile();
    if (file) uploadAndInsert(file);
  }, [editor, uploadAndInsert]);

  // ── Link ────────────────────────────────────────────────────────────────────
  const addLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href ?? '';
    const url = window.prompt('Nhập đường dẫn URL:', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  // ── Table ───────────────────────────────────────────────────────────────────
  const insertTable = useCallback((rows: number, cols: number) => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setShowTableGrid(false);
    setHoverGrid({ r: 0, c: 0 });
  }, [editor]);

  if (!editor) return null;

  const activeTextColor = editor.getAttributes('textStyle').color as string | undefined;
  const activeHighlight = editor.getAttributes('highlight').color as string | undefined;

  return (
    <div className={`flex flex-col border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-black/20 focus-within:border-brand-gold transition-colors ${className ?? ''}`}>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-brand-card/50 border-b border-slate-200 dark:border-white/10 rounded-t-2xl sticky top-0 z-[50] shadow-sm">

        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} title="Hoàn tác" />
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} title="Làm lại" />
        <Divider />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} icon={Bold} title="In đậm" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} icon={Italic} title="In nghiêng" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} icon={UnderlineIcon} title="Gạch chân" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} icon={Strikethrough} title="Gạch ngang" />
        <Divider />

        <ToolbarBtn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} icon={Type} title="Văn bản thường" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} icon={Heading1} title="Tiêu đề lớn (H2)" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} icon={Heading2} title="Tiêu đề nhỏ (H3)" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} icon={Quote} title="Trích dẫn" />
        <Divider />

        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Căn trái" />
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Căn giữa" />
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Căn phải" />
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} title="Căn đều" />
        <Divider />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} icon={List} title="Danh sách chấm" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} icon={ListOrdered} title="Danh sách số" />
        <Divider />

        {/* Text color picker */}
        <ColorPickerPopover
          label="Màu chữ"
          activeColor={activeTextColor}
          onSelect={color => editor.chain().focus().setColor(color).run()}
        >
          <div className={`p-2 rounded-lg transition-colors border border-transparent hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer`}>
            <div className="relative">
              <Palette size={16} className="text-slate-600 dark:text-brand-muted" />
              {activeTextColor && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-brand-card"
                  style={{ backgroundColor: activeTextColor }}
                />
              )}
            </div>
          </div>
        </ColorPickerPopover>

        {/* Highlight picker */}
        <ColorPickerPopover
          label="Tô sáng"
          activeColor={activeHighlight}
          onSelect={color => editor.chain().focus().setHighlight({ color }).run()}
        >
          <div className={`p-2 rounded-lg transition-colors border cursor-pointer ${
            editor.isActive('highlight')
              ? 'bg-brand-gold/20 border-brand-gold/30'
              : 'border-transparent hover:bg-slate-100 dark:hover:bg-white/10'
          }`}>
            <div className="relative">
              <Highlighter size={16} className={editor.isActive('highlight') ? 'text-brand-gold' : 'text-slate-600 dark:text-brand-muted'} />
              {activeHighlight && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-brand-card"
                  style={{ backgroundColor: activeHighlight }}
                />
              )}
            </div>
          </div>
        </ColorPickerPopover>
        <Divider />

        <ToolbarBtn onClick={addLink} active={editor.isActive('link')} icon={Link2} title="Chèn liên kết" />
        <ToolbarBtn onClick={() => fileInputRef.current?.click()} icon={ImageIcon} title="Chèn hình ảnh" />

        {/* Table grid */}
        <div className="relative" ref={tableGridRef}>
          <ToolbarBtn
            onClick={() => setShowTableGrid(v => !v)}
            active={showTableGrid || editor.isActive('table')}
            icon={TableIcon}
            title="Chèn bảng"
          />
          {showTableGrid && (
            <div className="absolute top-full right-0 mt-2 p-4 bg-white dark:bg-brand-card border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200 min-w-[240px]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400">Chọn kích thước nhanh</span>
                <span className="text-[10px] font-black text-brand-gold bg-brand-gold/5 px-2 py-0.5 rounded-full">{hoverGrid.r}x{hoverGrid.c}</span>
              </div>
              <div className="grid grid-cols-8 gap-1 bg-slate-50 dark:bg-black/20 p-2 rounded-xl mb-4">
                {[...Array(8)].map((_, r) =>
                  [...Array(8)].map((_, c) => (
                    <div
                      key={`${r}-${c}`}
                      onMouseEnter={() => setHoverGrid({ r: r + 1, c: c + 1 })}
                      onClick={() => insertTable(r + 1, c + 1)}
                      className={`w-4 h-4 rounded-sm border transition-all cursor-pointer ${
                        r < hoverGrid.r && c < hoverGrid.c
                          ? 'bg-brand-gold border-brand-gold shadow-[0_0_8px_rgba(251,191,36,0.4)] scale-110'
                          : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-brand-gold/50'
                      }`}
                    />
                  )),
                )}
              </div>
              <div className="border-t border-slate-100 dark:border-white/5 pt-4">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-3">Hoặc nhập kích thước</p>
                <div className="flex items-center gap-2">
                  <input ref={rowsRef} type="number" placeholder="Hàng" min="1" className="flex-1 px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:border-brand-gold outline-none" />
                  <span className="text-slate-300 text-xs">x</span>
                  <input ref={colsRef} type="number" placeholder="Cột" min="1" className="flex-1 px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:border-brand-gold outline-none" />
                  <button
                    type="button"
                    onClick={() => {
                      const r = Math.max(1, parseInt(rowsRef.current?.value || '1') || 1);
                      const c = Math.max(1, parseInt(colsRef.current?.value || '1') || 1);
                      insertTable(r, c);
                    }}
                    className="p-2 bg-brand-gold text-amber-950 rounded-lg hover:brightness-110 transition-all"
                  >
                    <Grid size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <Divider />

        <ToolbarBtn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} icon={Eraser} title="Xóa định dạng" />
      </div>

      {/* ── Bubble menu ─────────────────────────────────────────────────────── */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-1 p-1.5 bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl"
      >
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded-lg text-xs font-black transition-colors ${editor.isActive('bold') ? 'bg-brand-gold text-amber-950' : 'text-white hover:bg-white/10'}`}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded-lg text-xs italic font-black transition-colors ${editor.isActive('italic') ? 'bg-brand-gold text-amber-950' : 'text-white hover:bg-white/10'}`}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded-lg text-xs underline font-black transition-colors ${editor.isActive('underline') ? 'bg-brand-gold text-amber-950' : 'text-white hover:bg-white/10'}`}>U</button>
        <div className="w-px h-4 bg-white/20 mx-0.5" />
        <button type="button" onClick={addLink} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-brand-gold text-amber-950' : 'text-white hover:bg-white/10'}`}><Link2 size={13} /></button>
        {editor.isActive('link') && (
          <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={13} /></button>
        )}
      </BubbleMenu>

      {/* ── Editor area ─────────────────────────────────────────────────────── */}
      <EditorContent
        editor={editor}
        onPaste={handlePaste}
        className="
          p-8 md:p-12 min-h-[500px]
          prose prose-slate dark:prose-invert max-w-none
          prose-headings:font-bold
          prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-brand-gold prose-blockquote:text-slate-500 dark:prose-blockquote:text-slate-400
          prose-table:border-collapse
          text-slate-800 dark:text-gray-200 leading-relaxed bg-white dark:bg-[#0d1117]/50
          rounded-b-2xl focus:outline-none
        "
      />

      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }
        .tiptap table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        .tiptap table td,
        .tiptap table th {
          border: 2px solid #374151 !important;
          padding: 10px 14px;
          min-width: 80px;
          vertical-align: top;
          position: relative;
        }
        .tiptap table th {
          background: #f1f5f9;
          font-weight: 700;
          text-align: left;
        }
        .dark .tiptap table td,
        .dark .tiptap table th {
          border-color: #94a3b8 !important;
        }
        .dark .tiptap table th {
          background: rgba(255,255,255,0.06);
        }
        .tiptap .selectedCell {
          background: rgba(228,168,8,0.12) !important;
        }
      `}</style>
    </div>
  );
}
