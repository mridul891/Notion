// remove the border on click of the text area
// components/TiptapEditor.tsx
"use client";
import "./styles.scss";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { useEffect, useState } from "react";

import { TextAlign } from "@tiptap/extension-text-align";
import { MenuBar } from "./MenuBar";
import axios from "axios";
import CodeBlock from '@tiptap/extension-code-block'

interface TiptapEditorProps {
  content: string;
  onEditorContentSave: (html: string) => void;
}

export default function TiptapEditor({content , onEditorContentSave}: TiptapEditorProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CodeBlock
    ],
    content: ``,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-screen",
      },
    },
    onUpdate: ({ editor }) => {
      // Only call save after initialization to avoid cursor jumping
      if (isInitialized) {
        const html = editor.getHTML();
        onEditorContentSave(html);
      }
    },
  });

  // Set editor content when prop changes (only on initial load)
  useEffect(() => {
    if (editor && content !== undefined && content !== null) {
      // Only set content if editor is empty or significantly different
      const currentContent = editor.getHTML();
      if (currentContent === '<p></p>' || currentContent === '' || !currentContent) {
        editor.commands.setContent(content);
        setIsInitialized(true);
      }
    }
  }, [content, editor]);

  // Mark as initialized when editor is ready
  useEffect(() => {
    if (editor && !isInitialized) {
      setIsInitialized(true);
    }
  }, [editor, isInitialized]);

  // Handler for AI content generation
  const handleGenerateWithAI = async (headingText: string) => {
    if (!editor) return;
    // Call backend API to generate content
    try {
      const response = await axios.post("/api/gemini-generate", { prompt: headingText });
      const generatedContent = response.data.content;
      // Insert generated content below the heading
      editor.chain().focus().insertContent(generatedContent).run();
    } catch (error) {
      console.error("Error generating AI content:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto  ">
      <div className=" rounded-md p-4  border-none focus-within:outline-none">
        {editor && <MenuBar editor={editor} onGenerateWithAI={handleGenerateWithAI} />}
        <EditorContent
          editor={editor}
          className="mt-4 min-h-screen focus:outline-none focus:ring-0 border-none"
        />
      </div>
    </div>
  );
}
