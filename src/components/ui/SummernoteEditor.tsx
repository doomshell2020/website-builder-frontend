"use client";

import React, { useEffect, useRef } from "react";
import "summernote/dist/summernote-lite.css";
import $ from "jquery";
import "summernote/dist/summernote-lite.js";

interface SummernoteEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string; // 👈 allow placeholder as prop
}

export default function SummernoteEditor({
  value,
  onChange,
  placeholder = "Write here...",
}: SummernoteEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false); // 👈 prevent loops

  useEffect(() => {
    const $el = $(editorRef.current!);

    $el.summernote({
      height: 250,
      placeholder: placeholder, // 👈 add placeholder
      callbacks: {
        onChange: (contents: string) => {
          isInternalChange.current = true;
          onChange(contents); // send HTML back to parent
        },
        onInit: function () {
          $(".note-editable").css("background-color", "#ffffff");
        },
      },
    });

    // set initial content
    $el.summernote("code", value);

    return () => {
      $el.summernote("destroy");
    };
  }, [placeholder]); // 👈 re-init if placeholder changes

  // update only when parent value changes externally
  useEffect(() => {
    const $el = $(editorRef.current!);
    if (!isInternalChange.current && $el.summernote("code") !== value) {
      $el.summernote("code", value);
    }
    isInternalChange.current = false;
  }, [value]);

  return <div ref={editorRef} />;
}
