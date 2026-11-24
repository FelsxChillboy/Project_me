"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImagePlus,
  Undo2,
  Redo2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis isi berita di sini...",
}: RichTextEditorProps) {
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      ImageExtension,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "article-content min-h-[280px] max-w-none px-4 py-3 outline-none",
      },
    },
    onUpdate({ editor: ed }) {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[320px] rounded-md border border-[#D8D1C3] bg-[#FFFDF9] p-4 text-sm text-[#475467]">
        Memuat editor...
      </div>
    );
  }

  function handleSetLink() {
    if (!editor) return;
    const prevUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Masukkan URL tautan (kosongkan untuk menghapus):", prevUrl);
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const safeUrl = /^https?:\/\//i.test(url.trim())
      ? url.trim()
      : `https://${url.trim()}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href: safeUrl }).run();
  }

  async function handleInsertImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setUploadErr("");
    setUploadingImg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.success) {
        setUploadErr(json.error || "Gagal mengunggah gambar");
      } else {
        editor.chain().focus().setImage({ src: json.data.url }).run();
      }
    } catch {
      setUploadErr("Gagal mengunggah gambar ke server.");
    } finally {
      setUploadingImg(false);
      e.target.value = "";
    }
  }

  const btnClass = (active: boolean) =>
    cn(
      "inline-flex h-9 w-9 items-center justify-center rounded transition-colors",
      active
        ? "bg-[#14263D] text-white"
        : "text-[#14263D] hover:bg-[#EFECE4]"
    );

  return (
    <div className="overflow-hidden rounded-md border border-[#8C8272] bg-[#FFFDF9] focus-within:border-[#1E3A5F] focus-within:ring-2 focus-within:ring-[#1E3A5F]/40">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#D8D1C3] bg-[#F2EDE1] p-1.5">
        <button
          type="button"
          aria-label="Tebal"
          title="Tebal"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive("bold"))}
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Miring"
          title="Miring"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive("italic"))}
        >
          <Italic className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Garis Bawah"
          title="Garis Bawah"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnClass(editor.isActive("underline"))}
        >
          <UnderlineIcon className="h-4 w-4" aria-hidden="true" />
        </button>

        <span className="mx-1 h-5 w-px bg-[#D8D1C3]" />

        <button
          type="button"
          aria-label="Subjudul H2"
          title="Subjudul H2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive("heading", { level: 2 }))}
        >
          <Heading2 className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Subjudul H3"
          title="Subjudul H3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive("heading", { level: 3 }))}
        >
          <Heading3 className="h-4 w-4" aria-hidden="true" />
        </button>

        <span className="mx-1 h-5 w-px bg-[#D8D1C3]" />

        <button
          type="button"
          aria-label="Daftar Poin"
          title="Daftar Poin"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive("bulletList"))}
        >
          <List className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Daftar Bernomor"
          title="Daftar Bernomor"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive("orderedList"))}
        >
          <ListOrdered className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Kutipan"
          title="Kutipan"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive("blockquote"))}
        >
          <Quote className="h-4 w-4" aria-hidden="true" />
        </button>

        <span className="mx-1 h-5 w-px bg-[#D8D1C3]" />

        <button
          type="button"
          aria-label="Sisipkan Tautan"
          title="Sisipkan Tautan"
          onClick={handleSetLink}
          className={btnClass(editor.isActive("link"))}
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
        </button>

        <label
          aria-label="Sisipkan Gambar"
          title="Sisipkan Gambar"
          className={cn(
            "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded text-[#14263D] transition-colors hover:bg-[#EFECE4]",
            uploadingImg && "pointer-events-none opacity-50"
          )}
        >
          {uploadingImg ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleInsertImage}
            disabled={uploadingImg}
          />
        </label>

        <span className="mx-1 h-5 w-px bg-[#D8D1C3]" />

        <button
          type="button"
          aria-label="Undo"
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="inline-flex h-9 w-9 items-center justify-center rounded text-[#14263D] hover:bg-[#EFECE4] disabled:opacity-40"
        >
          <Undo2 className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Redo"
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="inline-flex h-9 w-9 items-center justify-center rounded text-[#14263D] hover:bg-[#EFECE4] disabled:opacity-40"
        >
          <Redo2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {uploadErr && (
        <div
          role="alert"
          className="border-b border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-900"
        >
          {uploadErr}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
