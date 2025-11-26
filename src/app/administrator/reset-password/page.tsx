'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Label } from '@/components/ui/Label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import { ResetPasswordByToken } from '@/services/admin.service';
import Link from 'next/link';

const schema = z.object({
    password: z.string().min(6, 'Password must be min 6 characters'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

type ResetForm = z.infer<typeof schema>;

export default function ResetPassword() {
    const router = useRouter();
    const token = useSearchParams().get("token");

    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
        resolver: zodResolver(schema)
    });

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token]);

    const onSubmit = async (data: ResetForm) => {
        setLoading(true);

        try {
            const res: any = await ResetPasswordByToken({
                token,
                password: data.password,
            });
            console.log(" res :", res);


            if (res?.status === true) {
                Swal.fire({
                    icon: "success",
                    title: "Password Updated!",
                    text: "You can now login with your new password."
                });
                router.push("/administrator");
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Password Not updated!",
                    text: "Maybe token is expired restart from forget process."
                });
            }

        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Invalid or expired link",
                text: error?.response?.data?.message || "Try again"
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-white flex">

            {/* Left Form */}
            <div className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <Card className="shadow-2xl border-0 rounded-lg bg-white/95 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center font-bold">Reset Password</CardTitle>
                        </CardHeader>
                        <CardContent>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                <div>
                                    <Label>New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <Input
                                            {...register("password")}
                                            type={showPass ? "text" : "password"}
                                            placeholder="Enter new password"
                                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                            onKeyDown={(e) => {
                                                if (e.key === " ") e.preventDefault();
                                            }}
                                        />
                                        <button type="button" className="absolute right-3 top-3" onClick={() => setShowPass(!showPass)}>
                                            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <p className="text-red-500 text-sm">{errors.password?.message}</p>
                                </div>

                                <div>
                                    <Label>Confirm Password</Label>
                                    <Input
                                        {...register("confirmPassword")}
                                        type="password"
                                        placeholder="Confirm password"
                                        className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        onKeyDown={(e) => {
                                            if (e.key === " ") e.preventDefault();
                                        }}
                                    />
                                    <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
                                </div>

                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-[#5ea3fa] hover:bg-[#296cc0] rounded-[5px] text-white px-6 py-2 min-w-[110px] flex items-center justify-center disabled:opacity-60"
                                >
                                    {loading ? "Saving..." : "Save Password"}
                                </Button>

                            </form>

                            <div className="mt-4 text-center">
                                <Link href="/administrator" className="text-sm text-blue-500 hover:text-blue-700">Back to Login</Link>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right Branding */}
            {/* <ResetBranding /> */}

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


{/**
    if (
        cleanHost === MAIN_DOMAIN ||
        cleanHost === `www.${MAIN_DOMAIN}` ||
        cleanHost === LOCAL_DEV_DOMAIN ||
        LOCAL_DOMAINS.includes(host)
      ) {
        // Protected route group logic
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/administrator") ||
          pathname.startsWith("/user")
        ) {
          // ❌ If no token and route is NOT public → redirect to login
          if (!token && !PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
            const loginUrl = new URL("/administrator", request.url);
            const res = NextResponse.redirect(loginUrl);
    
            // Clear cookies on redirect
            cookies.getAll().forEach((c) =>
              res.cookies.set(c.name, "", { path: "/", maxAge: 0 })
            );
    
            return res;
          }
        }
    
        // Allow normal access
        return NextResponse.next();
      }
*/}