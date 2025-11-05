"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { cmsStaticSchema } from "@/schemas/static.schema";
import { createStatic } from "@/services/static.service";
import dynamic from "next/dynamic";

const SummernoteEditor = dynamic(() => import("@/components/ui/SummernoteEditor"), {
  ssr: false,
});
type FormData = z.infer<typeof cmsStaticSchema>;

export default function AddStaticForm() {
  const router = useRouter();
  const [content, setContent] = useState<string | null>();
  const [isUrlFocused, setIsUrlFocused] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(cmsStaticSchema),
    mode: "onSubmit",
  });

  const nameValue = watch("title");
  useEffect(() => {
    if (!isUrlFocused) {
      const generatedurl = nameValue
        ?.toLowerCase()
        .trim()
        .replace(/[{}]/g, "")
        .replace(/[^a-z{}\-\s]/g, "") // allow only letters, { }, -, and spaces
        .replace(/[\s-]+/g, "-")      // collapse spaces/dashes → single dash
        .replace(/^-+|-+$/g, "");     // trim leading/trailing -

      setValue("url", generatedurl || ""); // 👈 important
    }
  }, [nameValue, isUrlFocused, setValue]);


  const handleBack = () => {
    router.push("/user/static");
  };

  const onSubmit = async (data: FormData) => {
    try {
      interface StaticPayload {
        title: string;
        url?: string;
        content: string;
      }
      const payload: StaticPayload = {
        title: data.title,
        url: data.url,
        content: data.content,
      };

      const response: any = await createStatic(payload);

      if (response?.status === true) {
        SwalSuccess("Static has been saved successfully.");
        router.push("/user/static");
      } else {
        SwalError({
          title: "Failed!",
          message: response?.message || "Failed to create Static.",
        });
      }
    } catch (error: any) {
      let message = "Something went wrong.";
      if (typeof error === "object" && error !== null && "response" in error) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      SwalError({
        title: "Error!",
        message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            {/* <Button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </Button> */}
            <h1 className="text-xl font-medium text-gray-800 ml-2">Add Static</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            {/* Title */}
            <div>
              <Label htmlFor="title">
                Title <span className="text-red-600">*</span>
              </Label>
              <Input id="title" {...register("title")} placeholder="Enter Title"
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                    "Home",
                    "End",
                  ];

                  if (allowedKeys.includes(e.key)) return;

                  // Allow only A-Z, a-z, dash, {, }
                  if (!/^[A-Za-z\-\{\} ]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData("text");
                  const filtered = pasted.replace(/[^A-Za-z\-\{\} ]/g, ""); // remove invalid chars
                  document.execCommand("insertText", false, filtered);
                }} />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* URL */}
            <div>
              <Label htmlFor="url">
                URL <span className="text-red-600">*</span>
              </Label>
              <Input id="url" {...register("url")} placeholder="Enter URL"
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                    "Home",
                    "End",
                  ];
                  if (allowedKeys.includes(e.key)) return;
                  if (e.key === " ") {
                    e.preventDefault();

                    const input = e.currentTarget;
                    const { selectionStart, selectionEnd, value } = input;

                    if (selectionStart !== null && selectionEnd !== null) {
                      const before = value.slice(0, selectionStart);
                      const after = value.slice(selectionEnd);

                      // insert dash and collapse consecutive dashes
                      const newValue = (before + "-" + after).replace(/-+/g, "-");

                      input.value = newValue;

                      // move cursor
                      const pos = before.length + 1;
                      input.setSelectionRange(pos, pos);
                    }
                    return;
                  }
                  if (e.key === "-") {
                    const input = e.currentTarget;
                    const { selectionStart, value } = input;

                    if (selectionStart !== null) {
                      const before = value[selectionStart - 1];
                      const after = value[selectionStart];

                      if (before === "-" || after === "-") {
                        e.preventDefault(); // block duplicate dashes
                        return;
                      }
                    }
                  }
                  if (!/^[a-z\-\\]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData("text");
                  let filtered = pasted
                    .replace(/[^a-z\-\\ ]/g, "") // allow letters, {}, -, space
                    .replace(/\s+/g, "-")             // convert space(s) to single dash
                    .replace(/-+/g, "-");             // collapse multiple dashes
                  document.execCommand("insertText", false, filtered);
                }} />
              {errors.url && (
                <p className="text-red-600 text-sm">{errors.url.message}</p>
              )}
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <Label htmlFor="content">
                Content <span className="text-red-600">*</span>
              </Label>
              <SummernoteEditor
                value={content}
                onChange={(html) => {
                  setContent(html);
                  setValue("content", html, { shouldValidate: true });
                }}
                placeholder="Enter content here..."
              />
              {errors.content && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-between">
            <Button
              type="button"
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-[5px]"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-700 rounded-[5px] text-white px-6 py-2 min-w-[110px] flex items-center justify-center disabled:opacity-60 "
            >
              {isSubmitting ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
