'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { z } from 'zod';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminLogin } from '@/services/admin.service';
import { setToken, setLogo, setSchema, getToken, setFolder, setRole } from '@/lib/auth';
import { SwalError } from "@/components/ui/SwalAlert";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
type LoginFormData = z.infer<typeof schema>;
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3 as string; // use env var

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

const LoginScreen = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  // newly added function 9/10/2025 7:00
  useEffect(() => {
    setIsClient(true);
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {

      // try {
      //   // 🚀 1️⃣ Execute reCAPTCHA v3
      //   const reCAPTCHAtoken = await recaptchaRef.current?.executeAsync();
      //   recaptchaRef.current?.reset();

      //   // ⚠️ 2️⃣ Token missing → domain/key not configured correctly
      //   if (!reCAPTCHAtoken) {
      //     SwalError({
      //       title: "reCAPTCHA Not Configured",
      //       message:
      //         "reCAPTCHA verification failed to load. This site key may not be registered for this domain.",
      //     });
      //     return;
      //   }

      //   // 🔐 3️⃣ Verify reCAPTCHA token with backend
      //   const { data: recaptchaRes } = await axios.post(
      //     `${process.env.NEXT_PUBLIC_API_URL_LOCAL}reCAPTCHA/verify-recaptcha`,
      //     { reCAPTCHAtoken }
      //   );

      //   // ❌ 4️⃣ Handle verification or configuration errors
      //   if (recaptchaRes?.errorCodes?.includes("invalid-input-secret")) {
      //     SwalError({
      //       title: "Invalid reCAPTCHA Configuration",
      //       message:
      //         "This reCAPTCHA site key or secret key is invalid for the current domain.",
      //     });
      //     return;
      //   }

      //   if (!recaptchaRes?.success && !recaptchaRes?.message) {
      //     SwalError({
      //       title: "Bot Detected!",
      //       message:
      //         "reCAPTCHA verification failed. Please refresh the page and try again.",
      //     });
      //     return;
      //   }

      // } catch (err: any) {
      //   // 🧱 Handles both network & execution errors
      //   console.error("reCAPTCHA Error:", err);
      //   SwalError({
      //     title: "Verification Error",
      //     message:
      //       "Unable to verify reCAPTCHA. Please ensure the correct domain and try again.",
      //   });
      // }

      // ✅ Proceed with login if verified
      const response: any = await AdminLogin(data as { email: string; password: string });
      const role = response?.user?.role;

      if (response.status === true) {
        setSchema(response?.user?.schema);
        setLogo(response?.user?.company_logo);
        setFolder(response?.user?.image_folder);
        setRole(role);
        setToken(response.token);

        if (role == '1') { router.push('/admin/users'); }
        else if (role == '2') { router.push('/user/enquiry'); }
        else { router.push('/'); }
        // setLoading(false);
      } else {
        setLoading(false);
        SwalError({ title: 'Failed!', message: response?.message || 'Check credentials.' });
      }
    } catch (error: any) {
      console.error('Error during reCAPTCHA or login:', error);

      const backendMessage = error?.response?.data?.message || error?.message || '';

      const isRecaptchaError = error?.response?.status === 400 || backendMessage?.toLowerCase()?.includes('recaptcha');

      // ✅ Define clear error message
      const errorMsg = isRecaptchaError
        ? 'reCAPTCHA verification failed! Please try again.'
        : backendMessage || 'Login failed! Try again.';

      SwalError({ title: 'Failed!', message: errorMsg, });
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex">

      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-3xl font-bold text-center text-gray-800">
                Login
              </CardTitle>
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
                    // required
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      {...register('password')}
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    // required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5ea3fa] hover:bg-[#296cc0] rounded-[5px] text-white px-6 py-2 min-w-[110px] flex items-center justify-center disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  // href="/administrator/forgot-password"
                  href="#"
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Branding */}
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

      {/* Right bottom - V3 reCAPTCHA */}
      {/* <ReCAPTCHA
        className="z-[99]"
        ref={recaptchaRef}
        size="invisible"
        sitekey={SITE_KEY}
      /> */}
    </div>
  );
};

export default LoginScreen;