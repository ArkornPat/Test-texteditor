"use client";
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions } from "./EditorExtension";
import EditorMenu from "./editor-menu";
import { postProcessHtml } from "../utils";

interface Section {
  menuId: string;
  title: string;
  content: string;
}

const ContentH2 = ({ section }: { section: Section }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(section.content);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const contentEditor = useEditor({
    extensions: editorExtensions,
    content: section.content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "textarea w-full h-full textarea-bordered",
      },
    },
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      const processedHtml = postProcessHtml(updatedContent);
      section.content = processedHtml;
      setHtmlContent(processedHtml);
    },
  });

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedHtml = e.target.value;
    setHtmlContent(updatedHtml);
    section.content = updatedHtml;
    contentEditor?.commands.setContent(updatedHtml);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full bg-base-100 p-4 min-h-screen">
      <EditorMenu
        editor={contentEditor}
        isHtmlMode={isHtmlMode}
        setIsHtmlMode={setIsHtmlMode}
      />
      {isHtmlMode ? (
        <textarea
          className="textarea textarea-bordered w-full h-64"
          value={htmlContent}
          onChange={handleHtmlChange}
          placeholder="Enter HTML content..."
        />
      ) : (
        <EditorContent editor={contentEditor} />
      )}
    </div>
  );
};

export default ContentH2;
