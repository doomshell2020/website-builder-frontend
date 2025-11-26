'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SwalError } from "@/components/ui/SwalAlert";
import { ForgotPassword } from '@/services/admin.service';
import Swal from 'sweetalert2';

const schema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);

        try {
            const res: any = await ForgotPassword(data as { email: string; });
            if (res?.status === true) {
                Swal.fire({
                    icon: "success",
                    title: "Check your email",
                    text: "If your account exists, a reset link has been sent."
                });
                router.push("/administrator");

            } else {
                SwalError({
                    title: "Failed!",
                    message: res?.message || "Something went wrong",
                });
            }

        } catch (err: any) {
            SwalError({
                title: "Failed!",
                message: err?.response?.data?.message || err?.message || "Something went wrong",
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">

            {/* Left Form */}
            <div className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="email"
                                            // type="email"
                                            placeholder="Enter your email"
                                            {...register('email')}
                                            name="email"
                                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                            onKeyDown={(e) => {
                                                if (e.key === " ") e.preventDefault();
                                            }}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-[#5ea3fa] hover:bg-[#296cc0] rounded-[5px] text-white px-6 py-2 min-w-[110px] flex items-center justify-center disabled:opacity-60"
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </form>

                            <div className="text-center mt-4">
                                <Link href="/administrator" className="text-sm text-blue-500 hover:text-blue-700">Back to Login</Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right Branding */}
            <ResetBranding />
        </div>
    );
}

function ResetBranding() {
    return (
        <div className="flex-1 bg-gradient-to-br from-blue-400 via-blue-500 to-white flex items-center justify-center p-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-white/20" />
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full blur-xl" />
            <div className="absolute bottom-32 right-16 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl" />

            {/* Logo and content */}
            <div className="relative z-10 text-center text-white">
                <div className="mb-6 lg:mb-8">

                    <div className="flex items-center gap-3 justify-center">
                        <img
                            src="/assest/image/logo_white.png" // fallback
                            alt="websitebuilder"
                            className="min-h-12 max-h-24"
                        />
                    </div>

                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4 tracking-tight">
                    Welcome to Doomshell Dashboards
                </h2>
            </div>
        </div>
    );
}
