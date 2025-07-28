"use client";
import {
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
  Code2,
  CircleParking,
} from "lucide-react";
import { useCallback } from "react";

export function MenuBar({ editor, onGenerateWithAI }: { editor: any, onGenerateWithAI?: (headingText: string) => void }) {
  if (!editor) return null;

  const buttonClass = (active: boolean) =>
    `p-2 rounded-sm transition hover:bg-white/10 ${
      active ? "bg-white/20 text-white" : "text-white"
    };`;

  const isHeading = editor && editor.isActive('heading');
  const getSelectedHeadingText = useCallback(() => {
    if (!editor) return '';
    const { state } = editor;
    const { from, to } = state.selection;
    let headingText = '';
    state.doc.nodesBetween(from, to, (node) => {
      if (node.type.name === 'heading') {
        headingText = node.textContent;
      }
    });
    return headingText;
  }, [editor]);

  return (
    <div className="flex justify-between  flex-wrap py-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={buttonClass(editor.isActive("paragraph"))}
      >
        <CircleParking size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
      >
        <Heading2 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
      >
        <Heading3 size={18} />
      </button>

      {/* Alignment Controls */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={buttonClass(editor.isActive({ textAlign: "left" }))}
      >
        <AlignLeft size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={buttonClass(editor.isActive({ textAlign: "center" }))}
      >
        <AlignCenter size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={buttonClass(editor.isActive({ textAlign: "right" }))}
      >
        <AlignRight size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={buttonClass(editor.isActive({ textAlign: "justify" }))}
      >
        <AlignJustify size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={buttonClass(editor.isActive("code"))}
      >
        <Code size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass(editor.isActive("codeBlock"))}
      >
        <Code2 size={18} />
      </button>
      {isHeading && onGenerateWithAI && (
        <button
          type="button"
          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
          onClick={() => {
            const headingText = getSelectedHeadingText();
            if (headingText) onGenerateWithAI(headingText);
          }}
        >
          Generate with AI
        </button>
      )}
    </div>
  );
}
