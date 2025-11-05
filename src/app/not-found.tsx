'use client';

import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Search, FileText, WifiOff } from "lucide-react"
import { Card } from "@/components/ui/card";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-purple-200 to-pink-300 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-pink-500/10" />
      <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="relative z-10 w-full max-w-4xl text-center space-y-12">
        {/* 404 Header */}
        <div className="space-y-4">
          <div className="relative">
            <div className="relative">
              <h1 className="relative text-8xl md:text-9xl font-black text-white drop-shadow-lg">
                404
              </h1>
              <div className="absolute inset-0 text-8xl md:text-9xl font-black text-white/20 blur-sm">
                404
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Page Not Found !
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              The page you’re looking for may have been moved,
              or doesn’t exist.
            </p>
          </div>
        </div>
        {/* Main Content Card */}
        <div className="flex justify-center items-center w-full">
          <Card className="max-w-[500px] flex item-center p-6 md:p-12 bg-white/80 backdrop-blur-sm border-cyan-400/20 shadow-2xl">
            <div className="grid md:grid-cols-1 gap-8 items-center">
              {/* Error Details */}
              <div className="order-1 md:order-2 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">What happened?</h3>
                  <ul className="text-left space-y-3 text-gray-600">
                    <li className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <span>The site reference might be incorrect</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <WifiOff className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <span>The internet may have been disconnected</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <span>The document may have been archived or moved</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Home className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <span>You might need updated access permissions</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Dashboard Button */}
                    {/* <Link href="/user/enquiry" className="flex-1">
                    <button
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                 bg-gradient-to-r from-sky-400 to-sky-500 
                 text-white font-semibold shadow-md hover:shadow-lg 
                 hover:from-sky-500 hover:to-sky-600 transition"
                    >
                      <Home className="w-5 h-5" />
                      Dashboard
                    </button>
                  </Link> */}

                    {/* Go Back Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        router.back();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl 
               border border-sky-400 text-sky-400 font-semibold 
               shadow-sm hover:bg-sky-50 hover:shadow-md transition"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Go Back
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Need help? Contact our support team for assistance with accessing specific documents.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div >
    </div >
  );
};