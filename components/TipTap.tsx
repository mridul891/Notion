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

export default function TiptapEditor({  }) {
  const [content, setContent] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: ``,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-screen",
      },
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return (
    <div className="max-w-4xl mx-auto mt-10 ">
      <div className=" rounded-md p-4  border-none focus-within:outline-none">
        {editor && <MenuBar editor={editor} />}
        <EditorContent
          editor={editor}
          className="mt-4 min-h-screen focus:outline-none focus:ring-0 border-none"
          onKeyDown={() => setContent(JSON.stringify(editor?.getHTML()))}
          value={content}
        />
      </div>
    </div>
  );
}
