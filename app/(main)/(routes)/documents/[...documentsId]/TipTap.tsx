"use client";
import TiptapEditor from "@/components/TipTapEditor";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";

const TipTap = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const documentsId = useParams();
  const { data: session } = useSession();

  // Fetch document content on mount
  useEffect(() => {
    const fetchContent = async () => {
      if (!documentsId.documentsId || !documentsId.documentsId[0]) { setLoading(false); return; }
      if (!session?.user?.email) { setLoading(false); return; }
      const id = documentsId.documentsId[0];
      const userId = session.user.email;
      try {
        const response = await axios.get(`/api/documents/get?id=${id}&userId=${userId}`);
        setContent(response.data.document?.content || "");
      } catch {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [documentsId.documentsId, session?.user?.email]);

  // Save document content on change
  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!documentsId.documentsId || !documentsId.documentsId[0]) return;
      if (!session?.user?.email) return;
      const id = documentsId.documentsId[0];
      const userId = session.user.email;
      await axios.put(`/api/documents/update?id=${id}&userId=${userId}`, { content });
    }, 2000);
    return () => clearTimeout(getData);
  }, [content, documentsId.documentsId, session?.user?.email]);

  const handleEditorContentSave = (html: string) => {
    setContent(html);
  };
  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      <TiptapEditor
        content={content}
        onEditorContentSave={handleEditorContentSave}
      />
    </div>
  );
};

export default TipTap;
