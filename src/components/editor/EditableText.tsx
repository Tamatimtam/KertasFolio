import React, { useEffect, useRef } from "react";

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  tagName?: "div" | "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
}

export default function EditableText({
  value,
  onChange,
  placeholder = "Click to edit",
  style,
  tagName = "div",
  className = "",
}: EditableTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Sync state changes from outside only if not currently focused
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.innerText = value;
    }
  }, [value]);

  const handleBlur = () => {
    if (ref.current) {
      const text = ref.current.innerText;
      if (text !== value) {
        onChange(text);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Enter if it's a inline span/heading element
    if (e.key === "Enter" && tagName !== "div" && tagName !== "p") {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  const Tag = tagName;

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      className={className}
      style={{
        outline: "none",
        cursor: "text",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        ...style,
      }}
    />
  );
}
