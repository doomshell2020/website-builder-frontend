"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import moment from "moment";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import InvoiceBreakdown from "@/components/InvoiceBreakdown";
import { subscriptionSchema } from "@/schemas/subscription.schema";
import { updateSubscription, getSubscriptionById } from "@/services/subscription.service";
import { viewAllPlans } from "@/services/plan.service";
import { SubscriptionAttribute } from '@/types/subscription'
import Loader from '@/components/ui/loader'

type FormData = z.infer<typeof subscriptionSchema>;

export default function AddSubscriptionForm() {
    const router = useRouter();
    const params = useParams();
    const id = String(params.id);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(subscriptionSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        shouldFocusError: true,
        defaultValues: {
            totaluser: 1,
        }
    });

    const handleBack = () => { router.back(); };
    // ---------- Local state ----------
    const [plans, setPlans] = useState<any[]>([]);
    const [subscription, setSubscription] = useState<SubscriptionAttribute | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [selectedPlanId, setSelectedPlanId] = useState<number | string | null>(null);
    const [selectedPlanName, setSelectedPlanName] = useState<string>("");
    const [selectedPlanUsers, setSelectedPlanUsers] = useState<number>(1);
    const [selectedPlanPrice, setSelectedPlanPrice] = useState<number>(0);

    const [billingStart, setBillingStart] = useState<Date | null>(null);
    const [billingEnd, setBillingEnd] = useState<Date | null>(null);

    // InvoiceBreakdown returns full totals via onTotalsChange
    const [invoiceTotals, setInvoiceTotals] = useState({
        discount: 0,
        basePrice: 0,
        discountInputValue: 0,
        discountType: "Amount",
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
        subTotal: 0
    });

    const toNum = (v: any, fallback = 0) => {
        if (v === null || v === undefined || v === "") return fallback;
        const n = Number(v);
        return Number.isNaN(n) ? fallback : n;
    };

    const toDatetimeLocalValue = (d?: Date | null) => {
        if (!d) return "";
        const pad = (n: number) => n.toString().padStart(2, "0");
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        setLoading(true);
        let isMounted = true;
        const fetchData = async () => {
            try {
                const [subscriptionRes, planRes]: any = await Promise.all([
                    getSubscriptionById(id),
                    viewAllPlans()
                ]);

                const sub = subscriptionRes?.result?.data ?? subscriptionRes.result ?? null;
                const planList = Array.isArray(planRes?.result?.data) ? planRes.result.data : [];

                if (!isMounted) return;
                setSubscription(sub);
                setPlans(planList);

                if (sub?.Customer) {
                    setSelectedCompany(sub.Customer);
                    setValue("c_id" as any, sub.c_id);
                }
                setLoading(false);
            } catch (error: any) {
                console.error("Fetching failed:", error?.message);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [id, setValue]);

    const parseISTDate = (raw: any) => {
        if (!raw) return null;
        const m = moment(raw).add(5.5, "hours");
        return new Date(m.format("YYYY-MM-DD HH:mm:ss"));
    };

    const selectPlanById = (planId: any) => {
        const chosen = plans.find((p) => p.id == planId);
        if (!chosen) {
            console.warn("Plan not found for id:", planId);
            setSelectedPlanId(null);
            setSelectedPlanName("");
            setSelectedPlanPrice(0);
            setSelectedPlanUsers(1);
            return;
        }

        setSelectedPlanId(planId);
        setSelectedPlanName(chosen.name ?? "");
        setSelectedPlanPrice(toNum(chosen.price, 0));
        setSelectedPlanUsers(toNum(subscription?.totaluser, 1));

        // Decide billing start: prefer subscription.created else now
        const start = subscription?.created
            ? parseISTDate(subscription.created)
            : new Date();

        setBillingStart(start);

        // Decide billing end: prefer subscription.expiry_date else start + 12 months
        let end = subscription?.expiry_date
            ? parseISTDate(subscription.expiry_date)
            : null;

        if (!end || isNaN(end.getTime())) {
            end = new Date(start);
            end.setMonth(end.getMonth() + 12);
        }

        setBillingEnd(end);

    };

    // When subscription AND plans loaded, set the defaults (auto-select old plan)
    useEffect(() => {
        if (!subscription) return;
        if (!plans || plans.length === 0) return;

        const oldPlanId = subscription.plan_id ?? subscription.Plan?.id;
        if (oldPlanId) {
            setValue("plan_id" as any, oldPlanId);
            selectPlanById(oldPlanId);
        } else {
            // still set dates if present
            if (subscription.created) setBillingStart(new Date(String(subscription.created)));
            if (subscription.expiry_date) setBillingEnd(new Date(String(subscription.expiry_date)));
        }

        // PRE-FILL discount only (do not overwrite computed totals)
        // DB stores discount as amount => default discount type: Amount
        const dbDiscount = toNum(subscription?.discount, 0);
        setInvoiceTotals((prev) => ({
            ...prev,
            discountInputValue: dbDiscount,
            discount: dbDiscount,
            discountType: "Amount"
        }));

        // Prefill other RHF values
        setValue("totaluser" as any, subscription.totaluser ?? 1);
        setValue("c_id" as any, subscription.c_id);
    }, [subscription, plans, setValue]);

    // When billingStart changes, auto-update billingEnd = +12 months (user cannot edit end)
    useEffect(() => {
        if (!billingStart) return;
        const end = new Date(billingStart);
        end.setMonth(end.getMonth() + 12);
        setBillingEnd(end);
    }, [billingStart]);

    // ---------- Handlers ----------
    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const planId = e.target.value;
        if (!planId) {
            setSelectedPlanId(null);
            setSelectedPlanName("");
            setSelectedPlanPrice(0);
            setSelectedPlanUsers(1);
            return;
        }
        selectPlanById(planId);
    };

    const handleInvoiceTotals = (totals: typeof invoiceTotals) => {
        // Ensure numeric types
        setInvoiceTotals({
            discount: toNum(totals.discount, 0),
            basePrice: toNum(totals.basePrice, 0),
            discountInputValue: toNum(totals.discountInputValue ?? totals.discount, 0),
            discountType: (totals as any).discountType ?? "Amount",
            cgst: toNum(totals.cgst ?? 0, 0),
            sgst: toNum(totals.sgst ?? 0, 0),
            igst: toNum(totals.igst ?? 0, 0),
            totalTax: toNum((totals as any).totalTax ?? (totals as any).taxprice ?? 0, 0),
            subTotal: toNum(totals.subTotal ?? 0, 0)
        });
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (!data?.plan_id || !data?.c_id) {
                console.log("Client or Plan is not selected yet!"); return;
            }

            const payload: SubscriptionAttribute = {
                plan_id: Number(data?.plan_id ?? selectedPlanId),
                c_id: data?.c_id ?? selectedCompany?.id ?? data.c_id,
                totaluser: selectedPlanUsers,
                per_user_rate: selectedPlanPrice,
                plantotalprice: invoiceTotals.subTotal,
                discount: invoiceTotals.discount, // saving amount (user requested)
                taxprice: invoiceTotals.totalTax,
                cgst: invoiceTotals.cgst,
                sgst: invoiceTotals.sgst,
                igst: invoiceTotals.igst,
                created: billingStart ? billingStart : (subscription?.created ?? ""),
                expiry_date: billingEnd ? billingEnd : (subscription?.expiry_date ?? ""),
                payment_detail: "0",
                status: "Y",
                email: subscription?.Customer?.email,
            };

            const response: any = await updateSubscription(id, payload);
            if (response?.status === true) {
                SwalSuccess("Subscription updated successfully.");
                handleBack();
            } else {
                SwalError({ title: "Failed!", message: response?.message ?? "Failed to connect.", });
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

    // ---------- Render ----------
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-12">
                        <h1 className="text-xl font-medium text-gray-800 ml-2">Edit Subscription</h1>
                    </div>
                </div>
            </header>
            <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {loading ? (<Loader />) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">

                            {/* Company */}
                            <div className="flex flex-col">
                                <Label className="text-xs font-medium mb-1">Select Company <span className="text-red-600">*</span></Label>
                                <Input
                                    id="company_name"
                                    type="text"
                                    disabled
                                    value={subscription?.Customer?.company_name ?? selectedCompany?.company_name ?? ""}
                                    placeholder="Company Name"
                                />
                                {typeof errors?.c_id?.message == "string" && (
                                    <p className="text-red-500 text-sm">{errors.c_id.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                                <Label htmlFor="email" className="mb-1 font-medium">Customer Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    disabled
                                    value={subscription?.Customer?.email ?? selectedCompany?.email ?? ""}
                                    placeholder="Customer Email"
                                />
                            </div>

                            {/* Mobile No */}
                            <div className="flex flex-col">
                                <Label htmlFor="mobile_no" className="mb-1 font-medium">Customer Number</Label>
                                <Input
                                    id="mobile_no"
                                    type="text"
                                    disabled
                                    value={subscription?.Customer?.mobile_no ?? selectedCompany?.mobile_no ?? ""}
                                    placeholder="Customer Number"
                                />
                            </div>

                            {/* Address */}
                            <div className="flex flex-col">
                                <Label htmlFor="address1" className="mb-1 font-medium">Address</Label>
                                <Input
                                    id="address1"
                                    type="text"
                                    disabled
                                    value={subscription?.Customer?.address1 ?? selectedCompany?.address1 ?? ""}
                                    placeholder="Customer Address"
                                />
                            </div>

                            {/* Plan selector */}
                            <div className="flex flex-col">
                                <Label className="text-xs font-medium mb-1">Select Plan <span className="text-red-600">*</span></Label>
                                <div className="relative">
                                    <select
                                        id="plans"
                                        {...register("plan_id", {
                                            required: "Plan is required",
                                            onChange: (e) => handlePlanChange(e),
                                        })}
                                        value={selectedPlanId ?? ""}
                                        className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-white border border-gray-300 appearance-none h-9 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 cursor-pointer"
                                    >
                                        <option value="">-- Select Plan --</option>
                                        {plans.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>

                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                                {typeof errors?.plan_id?.message == "string" && (
                                    <p className="text-red-500 text-sm">{errors.plan_id.message}</p>
                                )}
                            </div>

                            {/* Dates: Start (editable) | End (auto disabled) */}
                            <div className="flex flex-row gap-1">
                                <div className="flex flex-col w-1/2">
                                    <Label className="mb-1 font-medium">Billing Start</Label>
                                    <Input
                                        type="datetime-local"
                                        value={toDatetimeLocalValue(billingStart)}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setBillingStart(v ? new Date(v) : null);
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col w-1/2">
                                    <Label className="mb-1 font-medium">Billing End</Label>
                                    <Input
                                        type="datetime-local"
                                        value={toDatetimeLocalValue(billingEnd)}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Invoice / Bill */}
                        {selectedPlanId && billingStart && billingEnd && (
                            <InvoiceBreakdown
                                companyName={subscription?.Customer?.company_name ?? "Company"}
                                users={selectedPlanUsers}
                                pricePerUser={selectedPlanPrice}
                                billingStart={billingStart.toLocaleDateString("en-GB")}
                                billingEnd={billingEnd.toLocaleDateString("en-GB")}
                                planName={selectedPlanName}
                                gstType={subscription?.Customer?.gst_type == "IGST" ? "INTER" : "INTRA"}
                                discount={Number(subscription?.discount)}
                                onTotalsChange={(totals) => {
                                    handleInvoiceTotals(totals as any);
                                }}
                            />
                        )}

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
                )}
            </main>
        </div>
    );
};