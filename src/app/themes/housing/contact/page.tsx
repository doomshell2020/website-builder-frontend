"use client"

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { EnquiryAttributes } from "@/types/enquiry"
import { createEnquiry } from "@/services/enquiry.service";
import { enquirySchema } from "@/schemas/enquiry.schema";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { motion, Variants } from "framer-motion";
import { User } from "@/types/user";

interface DefaultProps { project?: User };
type FormData = z.infer<typeof enquirySchema>;

export default function Contact({ project }: DefaultProps) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(enquirySchema) as any,
    });
    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    const onSubmit = async (data: FormData) => {
        try {
            const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Enquiry Received - {COMPANY_NAME}</title>
  <style>
    body, table, td {
      font-family: 'Manrope', Arial, Helvetica, sans-serif;
    }
    img {
      border: none;
      display: block;
      outline: none;
      text-decoration: none;
    }
  </style>
</head>

<body style="margin:0; padding:0; background-color:#f7f6f3; font-family:'Manrope', Arial, sans-serif; color:#1a1a1a;">

  <!-- Background Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f7f6f3" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff"
               style="border-radius:16px; overflow:hidden; box-shadow:0 6px 25px rgba(0,0,0,0.07);">

          <!-- Hero Section -->
          <tr>
            <td align="center" background="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=80"
                style="background-size:cover; background-position:center; padding:60px 20px; text-align:center; color:#ffffff;">
              <div style="background-color:rgba(30, 41, 59, 0.85); border-radius:12px; padding:30px 20px; display:inline-block;">
                <img src="{LOGO_URL}" alt="{COMPANY_NAME}" style="max-height:65px; margin-bottom:18px;" />
                <h1 style="margin:0; font-size:24px; font-weight:700; color:#ffffff;">
                  Your Enquiry Has Been Received
                </h1>
                <p style="margin:10px 0 0; font-size:15px; color:#dbeafe;">
                  Thank you for contacting {COMPANY_NAME}
                </p>
              </div>
            </td>
          </tr>

          <!-- Body Section -->
          <tr>
            <td style="padding:40px; font-size:16px; line-height:1.7; color:#333;">
              <p style="margin:0 0 15px 0; font-size:20px; font-weight:700; color:#1f2937;">
                Dear {NAME},
              </p>

              <p style="margin:0 0 16px;">
                We appreciate your interest in <strong>{COMPANY_NAME}</strong> and our housing projects.  
                Your enquiry has been successfully received. Our property consultant will contact you within 
                <strong>24–48 hours</strong> to guide you through available plots, flats, or investment opportunities.
              </p>

              <!-- Enquiry Summary -->
              <div style="margin:25px 0; background-color:#faf8f6; border-left:4px solid #b45309; border-radius:8px; padding:16px 20px;">
                <p style="margin:0 0 6px; font-weight:600; color:#78350f;">Enquiry Details:</p>
                <p style="margin:0; color:#333;">{SUBJECT}</p>
              </div>

              <p style="margin:0 0 18px;">
                For immediate assistance, please call us at 
                <a href="tel:{COMPANY_PHONE}" style="color:#b45309; font-weight:600; text-decoration:none;">
                  {COMPANY_PHONE}
                </a> 
                or reply directly to this email.
              </p>

              <p style="margin:0;">
                Thank you for choosing <strong>{COMPANY_NAME}</strong> — we’re delighted to help you find your dream home.<br/>
                — The {COMPANY_NAME} Team
              </p>
            </td>
          </tr>

          <!-- CTA Section -->
          <tr>
            <td align="center" style="padding:10px 40px 50px;">
              <a href="{SITE_URL}"
                 style="background:linear-gradient(135deg,#b45309,#f59e0b);
                        color:#ffffff; text-decoration:none; padding:14px 36px;
                        border-radius:8px; font-weight:700; font-size:16px;
                        letter-spacing:0.3px; display:inline-block;">
                Explore Properties
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td align="center" style="padding:0 40px;">
              <hr style="border:0; height:1px; background-color:#e5e7eb; margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#1f2937; padding:25px; color:#f9fafb; font-size:13px;">
              <p style="margin:0 0 8px;">© {DATE} {COMPANY_NAME}. All rights reserved.</p>
              <p style="margin:0;">
                <a href="{SITE_URL}" style="color:#f59e0b; text-decoration:none;">Visit Our Site</a> | 
                <a href="mailto:{COMPANY_EMAIL}" style="color:#f59e0b; text-decoration:none;">Contact Support</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
 `
                .replaceAll('{NAME}', data?.name)
                .replaceAll('{SUBJECT}', data?.subject)
                .replaceAll('{COMPANY_PHONE}', project?.mobile_no)
                .replaceAll('{COMPANY_NAME}', project?.company_name)
                .replaceAll('{SITE_URL}', `https://${project?.subdomain}.xpertart.com`)
                .replaceAll('{DATE}', `${new Date().getFullYear()}`)
                .replaceAll('{LOGO_URL}', `https://navvistarinfra.com/wp-content/uploads/2025/08/logo-1.png`);

            const payload: EnquiryAttributes = {
                name: `${data.name} ${data.name2}`.trim(),
                email: data.email,
                mobile: data.mobile,
                subject: data.subject,
                html: html,
                company_name: project?.company_name,
                company_email: project?.email,
            };
            const response: any = await createEnquiry(project?.schema_name, payload);
            if (response?.status === true) {
                SwalSuccess("enquiry submitted successfully.");
                reset({
                    name: "",
                    email: "",
                    mobile: "",
                    subject: "",
                });
                router.push("/");
            } else {
                SwalError({
                    title: "Failed!",
                    message: response?.message ?? "Failed to connect.",
                });
            }
        } catch (error: any) {
            let message = "Something went wrong.";
            if (typeof error === "object" && error !== null && "response" in error) {
                message = error.response?.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            SwalError({ title: "Error!", message, });
        }
    };

    const formFields = {
        row1: [
            { placeholder: "First Name", name: "firstName" },
            { placeholder: "Last Name", name: "lastName" },
        ],
        row2: [
            { placeholder: "Email", name: "email" },
            { placeholder: "Phone", name: "phone" },
        ],
    };

    return (
        <div>
            <section className="flex flex-col items-center justify-center relative w-full">
                <div className="flex h-[459px] items-center justify-center gap-2.5 relative w-full bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),url(https://c.animaapp.com/miu4qofhUHi324/img/hero-gallery-1.png)] bg-cover bg-center bg-no-repeat translate-y-[-1rem] animate-fade-in opacity-0">
                    <div className="inline-flex items-center justify-center gap-2.5 relative">
                        <h1 className="relative w-fit mt-[-1.00px] font-poppinsregular-52 font-[number:var(--poppinsregular-52-font-weight)] text-white text-[length:var(--poppinsregular-52-font-size)] tracking-[var(--poppinsregular-52-letter-spacing)] leading-[var(--poppinsregular-52-line-height)] [font-style:var(--poppinsregular-52-font-style)]">
                            Contact Us
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-6 p-20 relative w-full -mt-10 bg-white rounded-[40px_40px_0px_0px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
                    <div className="flex flex-wrap items-center justify-center gap-[34px] relative w-full bg-white shadow-[1px_-1px_6px_#00000059]">
                        <div className="flex w-[393px] h-[611px] items-center justify-center gap-2.5 relative">
                            <img
                                className="flex-1 self-stretch grow relative object-cover"
                                alt="Contact support"
                                src="https://c.animaapp.com/miu4qofhUHi324/img/image-36-1.png"
                            />
                        </div>

                        <div className="flex flex-col w-[853px] items-center justify-center gap-[22px] pl-0 pr-5 py-5 relative">
                            <div className="flex items-center gap-2.5 relative w-full">
                                <h2 className="relative w-fit mt-[-1.00px] font-manrope-34 font-[number:var(--manrope-34-font-weight)] text-[#141414] text-[length:var(--manrope-34-font-size)] text-justify tracking-[var(--manrope-34-letter-spacing)] leading-[var(--manrope-34-line-height)] [font-style:var(--manrope-34-font-style)]">
                                    Let&apos;s Talk
                                </h2>
                            </div>

                            <div className="flex items-center gap-2.5 relative w-full">
                                <p className="relative flex-1 mt-[-1.00px] font-poppinsregular-20 font-[number:var(--poppinsregular-20-font-weight)] text-[#141414] text-[length:var(--poppinsregular-20-font-size)] text-justify tracking-[var(--poppinsregular-20-letter-spacing)] leading-[var(--poppinsregular-20-line-height)] [font-style:var(--poppinsregular-20-font-style)]">
                                    Our support team is here to guide you—no matter how big or small
                                    your concern.
                                </p>
                            </div>

                            <form className="flex flex-col items-end justify-end gap-7 relative w-full">
                                <div className="flex items-center justify-center gap-8 relative w-full">
                                    {formFields.row1.map((field, index) => (
                                        <Input
                                            key={field.name}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            className="flex-1 h-auto px-3.5 py-4 rounded-sm border border-solid border-[#141414] font-interregular-20 font-[number:var(--interregular-20-font-weight)] text-[#9a9393] text-[length:var(--interregular-20-font-size)] text-justify tracking-[var(--interregular-20-letter-spacing)] leading-[var(--interregular-20-line-height)] [font-style:var(--interregular-20-font-style)] placeholder:text-[#9a9393]"
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center justify-center gap-8 relative w-full">
                                    {formFields.row2.map((field, index) => (
                                        <Input
                                            key={field.name}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            className="flex-1 h-auto px-3.5 py-4 rounded-sm border border-solid border-[#141414] font-interregular-20 font-[number:var(--interregular-20-font-weight)] text-[#9a9393] text-[length:var(--interregular-20-font-size)] text-justify tracking-[var(--interregular-20-letter-spacing)] leading-[var(--interregular-20-line-height)] [font-style:var(--interregular-20-font-style)] placeholder:text-[#9a9393]"
                                        />
                                    ))}
                                </div>

                                <Textarea
                                    name="message"
                                    placeholder="Message"
                                    className="h-[199px] w-full px-3.5 py-4 rounded-sm border border-solid border-[#141414] font-interregular-20 font-[number:var(--interregular-20-font-weight)] text-[#9a9393] text-[length:var(--interregular-20-font-size)] text-justify tracking-[var(--interregular-20-letter-spacing)] leading-[var(--interregular-20-line-height)] [font-style:var(--interregular-20-font-style)] placeholder:text-[#9a9393] resize-none"
                                />

                                <Button
                                    type="submit"
                                    className="h-auto w-full px-[26px] py-4 bg-[#201667] hover:bg-[#201667]/90 transition-colors font-poppinsmedium-20 font-[number:var(--poppinsmedium-20-font-weight)] text-white text-[length:var(--poppinsmedium-20-font-size)] text-justify tracking-[var(--poppinsmedium-20-letter-spacing)] leading-[var(--poppinsmedium-20-line-height)] [font-style:var(--poppinsmedium-20-font-style)]"
                                >
                                    Submit
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};