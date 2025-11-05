// components/ui/SwalAlert.ts
"use client";

import Swal from "sweetalert2";

// ✅ Confirm Alert
export const SwalConfirm = async (
  {
    title = "Are you sure?",
    text = "This action cannot be undone!",
    confirmButtonText = "Yes",
    cancelButtonText = "Cancel",
    icon = "warning",
  }: {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    icon?: "warning" | "question";
  }
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};
// ✅ Success Alert
export const SwalSuccess = (
  input: string | { title?: string; message?: string }
) => {
  const title = typeof input === "string" ? "Success" : input.title || "Success";
  const message = typeof input === "string" ? input : input.message || "";

  Swal.fire({
    icon: "success",
    title,
    text: message,
    confirmButtonColor: "#3085d6",
  });
};
// ✅ Error Alert
export const SwalError = (
  input: string | { title?: string; message?: string }
) => {
  const title = typeof input === "string" ? "Error" : input.title || "Error";
  const message = typeof input === "string" ? input : input.message || "";

  Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonColor: "#d33",
  });
};
