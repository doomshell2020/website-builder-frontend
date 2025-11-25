"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { logout } from "@/lib/auth";
import { getUserSubscriptionByInvoiceId } from "@/services/subscription.service";
import { formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/price";
import { SubscriptionAttribute } from "@/types/subscription";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { Button } from "@/components/ui/Button";
import Loader from '@/components/ui/loader'
import { AdminProfile } from "@/services/admin.service";
import { generateInvoicePdf } from "@/components/InvoicePdf"

export default function BillingListPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleBack = () => { router.back(); };
    const [subscription, setSubscription] = useState<SubscriptionAttribute | null>(null);
    const [userId, setUserId] = useState<string | number>("");

    useEffect(() => {
        setLoading(true);
        const fetchUser = async () => {
            try {
                const res = await AdminProfile();
                const data: any = res.result;
                setUserId(data?.id);
            } catch (error) {
                // SwalError({ title: "Error", message: error?.message ?? "Failed to load user data." });
                console.log("Failed to load user data.", error?.message);
                // logout();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res: any = await getUserSubscriptionByInvoiceId(userId);
            setSubscription(res?.result || null);
        } catch (error) {
            console.error("Failed to fetch current active subscription:", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) fetchData();
    }, [userId, fetchData]);

    const handleExportPDF = (invoice: any) => {
        if (!invoice) { console.warn("Invoice missing"); return; }

        const customer = {
            name: invoice.Customer?.name || "",
            address1: invoice.Customer?.address1 || "",
            gstin: invoice.Customer?.gstin || "",
        };

        const plan = {
            name: invoice.Plan?.name || "",
            price: invoice.Plan?.price || ""
        };

        generateInvoicePdf({
            customer,
            plan,
            subscription: invoice,
            filename: "invoice" + (invoice.order_id || invoice.id),
        });
    };

    return (
        <div className="min-h-screen">
            <main className="max-w-10xl py-2">
                <div className="border shadow-xl p-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-gray-800">
                            Active Subscription
                        </h2>
                        <Button
                            title="Click to back"
                            onClick={handleBack}
                            className="min-w-[80px] p-2 rounded-[5px] bg-yellow-600 text-white hover:bg-yellow-700"
                        >
                            {isLoading ? (
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <> Back to Invoices </>
                            )}
                        </Button>
                    </div>

                    {loading
                        ? (
                            // 1️⃣ LOADING STATE
                            <div className="flex justify-center items-center h-64">
                                <Loader />
                            </div>
                        )
                        : !subscription
                            ? (
                                // 2️⃣ EMPTY RESULT STATE
                                <div className="bg-white border border-gray-200 rounded-xl shadow-md p-10 text-center">
                                    <p className="text-lg font-semibold text-gray-700">
                                        No subscription purchased yet
                                    </p>
                                    <p className="text-gray-500 mt-1 text-sm">
                                        Once you purchase a plan, details will appear here.
                                    </p>
                                </div>
                            )
                            : (
                                <div className="relative bg-white border border-gray-200 rounded-xl shadow-md p-5">
                                    {subscription?.status === 'N' && (
                                        <div className="mb-4 p-2">
                                            <span className="text-2xl font-bold text-red-600"> You currently don’t have an active plan. If you believe this is a mistake, please review your last purchase or contact support.</span>
                                        </div>
                                    )}
                                    <div className="border p-5 rounded-xl shadow-sm bg-white">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-lg font-semibold text-gray-900">{subscription?.Plan?.name} Plan</h2>
                                            <span className={`px-3 py-1 text-sm rounded 
                                            ${subscription?.status === 'Y' ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'}`}>
                                                {subscription?.status === 'Y' ? 'Active' : 'Inactive'}
                                            </span>

                                        </div>

                                        <div className="grid grid-cols-1 gap-4 mt-4 text-sm text-gray-600">
                                            <p><strong>Price:</strong> ₹{subscription?.Plan?.price || "price"}</p>
                                            <p><strong>Yearly Plan</strong></p>
                                            <p><strong>Start Date:</strong> {formatDate(subscription?.created)}</p>
                                            <p><strong>Expiry Date:</strong> {formatDate(subscription?.expiry_date)}</p>
                                        </div>

                                        {/* <div className="mt-3 text-blue-600 font-medium">
                                            {"daysLeft"} days remaining
                                        </div> */}
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="font-medium text-gray-800 mb-2">Billing & Invoices</h3>
                                        <table className="w-full text-sm border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                                                    <th className="p-2 text-left">Invoice</th>
                                                    <th className="p-2 text-left">Date</th>
                                                    <th className="p-2 text-left">Amount</th>
                                                    <th className="p-2 text-left">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b">
                                                    <td className="p-2">{String(subscription?.id ?? 0).padStart(6, "0")}</td>
                                                    <td className="p-2">{formatDate(subscription?.created)}</td>
                                                    <td className="p-2 font-medium">
                                                        ₹{formatPrice(Math.round(Number(subscription?.plantotalprice ?? "0")))}
                                                    </td>

                                                    <td className="p-2">
                                                        <button className="text-blue-600 hover:underline"
                                                            onClick={() => handleExportPDF(subscription)}>Download PDF</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-800">Renewal Settings</h3>
                                        <p className="text-sm text-gray-600 mt-3">
                                            All renewals and plan changes are managed by our admin team.
                                            If you need help updating your plan, billing details, or if there’s any issue,
                                            please contact our support:
                                        </p>

                                        <div className="mt-2 text-sm text-gray-700">
                                            📧 <strong>contact@doomshell.com</strong><br />
                                            📞 <strong>+91 8005523567</strong>
                                        </div>
                                    </div>
                                    <div className="fixed bottom-8 right-4 flex gap-3">
                                        <Button
                                            onClick={() => handleExportPDF(subscription)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-[6px] hover:bg-green-700">

                                            Download Invoice
                                        </Button>
                                    </div>
                                </div>
                            )}
                </div>
            </main >
        </div >
    );
};