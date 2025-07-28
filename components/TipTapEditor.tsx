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
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";

export default function TiptapEditor({content , onEditorContentSave}) {


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

  // Set editor content when prop changes
  useEffect(() => {
    if (editor && content !== undefined && content !== null) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleChange = () => {
    const html = editor?.getHTML();
    onEditorContentSave(html);
  };
  
  return (
    <div className="max-w-4xl mx-auto  ">
      <div className=" rounded-md p-4  border-none focus-within:outline-none">
        {editor && <MenuBar editor={editor} />}
        <EditorContent
          editor={editor}
          className="mt-4 min-h-screen focus:outline-none focus:ring-0 border-none"
          onKeyDown={()=>handleChange()}
        />
      </div>
    </div>
  );
}
