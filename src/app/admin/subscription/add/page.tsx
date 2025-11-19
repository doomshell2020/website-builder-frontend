"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import InvoiceBreakdown from "@/components/InvoiceBreakdown";
import { subscriptionSchema } from "@/schemas/subscription.schema";
import { createSubscription } from "@/services/subscription.service";
import { getAllUsers, getUserById } from "@/services/userService";
import { viewAllPlans } from "@/services/plan.service";
import { SubscriptionAttribute } from '@/types/subscription'
type FormData = z.infer<typeof subscriptionSchema>;

export default function AddSubscriptionForm() {
    const router = useRouter();
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
    const [companies, setCompanies] = useState([]);
    const [plans, setPlans] = useState([]);
    const [companyDetails, setCompanyDetails] = useState({
        email: "",
        mobile_no: "",
        address: "",
        gst_type: "",
    });

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                // Run both APIs in parallel
                const [companyRes, planRes]: any = await Promise.all([
                    getAllUsers(), viewAllPlans(),
                ]);

                const companyData = Array.isArray(companyRes?.result?.data)
                    ? companyRes.result.data : [];

                const planData = Array.isArray(planRes?.result?.data)
                    ? planRes.result.data : [];

                if (!isMounted) return;

                setCompanies(companyData);
                setPlans(planData);

            } catch (error: any) {
                console.error("Fetching failed:", error?.message);
                // SwalError({ title: "Failed!", message: error?.message || "Something went wrong." });
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const handleCompanySelect = async (companyId: string) => {
        if (!companyId) {
            // Reset if empty
            setCompanyDetails({
                email: "",
                mobile_no: "",
                address: "",
                gst_type: "",
            });
            return;
        }
        setSelectedCompany(companyId);
        try {
            const res: any = await getUserById(companyId);
            const user = res?.result ?? res?.result?.data;
            setCompanyDetails({
                email: user?.email || "",
                mobile_no: user?.mobile_no || "",
                address: user?.address1 || "",
                gst_type: user?.gst_type || "",
            });

        } catch (err: any) {
            console.log("Failed to fetch user:", err?.message);
            setCompanyDetails({
                email: "",
                mobile_no: "",
                address: "",
                gst_type: "",
            });
        }
    };

    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [selectedPlanName, setSelectedPlanName] = useState("");
    const [selectedPlanUsers, setSelectedPlanUsers] = useState(1);
    const [selectedPlanPrice, setSelectedPlanPrice] = useState(0);
    const [billingStart, setBillingStart] = useState(null);
    const [billingEnd, setBillingEnd] = useState(null);

    // invoice calculated values come from the InvoiceComponent
    const [invoiceTotals, setInvoiceTotals] = useState({
        discount: 0,
        basePrice: 0,
        discountInputValue: 0,
        discountType: "",
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
        subTotal: 0
    });

    const handlePlanChange = (e) => {
        const planId = e.target.value;
        if (!planId) return;

        const selected = plans.find((p) => p.id == planId);
        setSelectedPlanId(planId);
        setSelectedPlanName(selected.name);
        setSelectedPlanPrice(selected.price);
        setSelectedPlanUsers(1);

        const PLAN_DURATIONS = {
            All: { months: 12 }
        };

        const duration = PLAN_DURATIONS["All"];
        const startDate = new Date();

        let endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + duration.months);
        setBillingStart(startDate);
        setBillingEnd(endDate);
    };

    const formatForDB = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, "0");
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (!data?.plan_id || !data?.c_id) {
                console.log("Client or Plan is not selected yet!");
                return;
            }
            const payload: SubscriptionAttribute = {
                plan_id: data?.plan_id ?? selectedPlanId,
                c_id: data?.c_id ?? selectedCompany,
                totaluser: selectedPlanUsers,
                per_user_rate: selectedPlanPrice,
                plantotalprice: invoiceTotals.subTotal,
                // subTotal: invoiceTotals.subTotal,
                discount: invoiceTotals.discount,
                taxprice: invoiceTotals.totalTax,
                cgst: invoiceTotals.cgst,
                sgst: invoiceTotals.sgst,
                igst: invoiceTotals.igst,
                created: formatForDB(billingStart),
                expiry_date: formatForDB(billingEnd),
                payment_detail: "0",
                status: "Y",
                email: companyDetails?.email,
            };

            const response: any = await createSubscription(payload);
            if (response?.status === true) { SwalSuccess("Subscription added successfully."); handleBack(); }
            else { SwalError({ title: "Failed!", message: response?.message ?? "Failed to connect.", }); }
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

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-12">
                        <h1 className="text-xl font-medium text-gray-800 ml-2">Add Subscription</h1>
                    </div>
                </div>
            </header>
            <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md" >

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">

                        {/* Company */}
                        <div className="flex flex-col">
                            <Label className="text-xs font-medium mb-1">Select Company <span className="text-red-600">*</span></Label>
                            <div className="relative">
                                <select
                                    id="company"
                                    className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-white border border-gray-300 appearance-none dark:bg-dark-900 h-9 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
                                    {...register("c_id", {
                                        required: "Customer is Required",
                                        onChange: (e) => handleCompanySelect(e.target.value), // <-- use register's onChange
                                    })}
                                >
                                    <option value="">
                                        -- Select Company --
                                    </option>
                                    {companies.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.company_name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                />
                            </div>
                            {typeof errors?.c_id?.message == "string" && (
                                <p className="text-red-500 text-sm">{errors.c_id.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <Label htmlFor="email" className="mb-1 font-medium">
                                Customer Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                disabled
                                value={companyDetails.email}
                                placeholder="Customer Email"
                            />
                        </div>

                        {/* Mobile No */}
                        <div className="flex flex-col">
                            <Label htmlFor="mobile_no" className="mb-1 font-medium">
                                Customer Number
                            </Label>
                            <Input
                                id="mobile_no"
                                type="text"
                                disabled
                                value={companyDetails.mobile_no}
                                placeholder="Customer Number"
                            />
                        </div>

                        {/** Address */}
                        <div className="flex flex-col">
                            <Label htmlFor="address1" className="mb-1 font-medium">
                                Address
                            </Label>
                            <Input
                                id="address1"
                                type="text"
                                disabled
                                value={companyDetails.address}
                                placeholder="Customer Address"
                            />

                        </div>

                        {/* Plans */}
                        <div className="flex flex-col">
                            <Label className="text-xs font-medium mb-1">Select Plan <span className="text-red-600">*</span></Label>
                            <div className="relative">
                                <select
                                    id="plans"
                                    {...register("plan_id", {
                                        required: "Plan is required",
                                        onChange: (e) => handlePlanChange(e), // here e is event
                                    })}
                                    className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-white border border-gray-300 appearance-none dark:bg-dark-900 h-9 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
                                >
                                    <option value="">
                                        -- Select Plan --
                                    </option>
                                    {plans.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                />
                            </div>
                            {typeof errors?.plan_id?.message == "string" && (
                                <p className="text-red-500 text-sm">{errors.plan_id.message}</p>
                            )}
                        </div>

                        {/* Total Users
                        <div className="flex flex-col">
                            <Label htmlFor="totaluser" className="mb-1 font-medium">Total Users <span className="text-red-600">*</span></Label>
                            <Input
                                id="totaluser"
                                type="number"
                                step="any"
                                min="0"
                                disabled
                                {...register("totaluser", {
                                    onChange: (e) => {
                                        const value = Number(e.target.value) || 0;
                                        setSelectedPlanUsers(value);
                                    },
                                })}
                                placeholder="Enter Total Users"
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-"].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            {errors.totaluser && <p className="text-red-600">{errors.totaluser.message}</p>}
                        </div> */}
                    </div>

                    {/* Invoice / Bill */}
                    {selectedCompany && selectedPlanId && (
                        <InvoiceBreakdown
                            companyName="Doomshell"
                            users={selectedPlanUsers}
                            pricePerUser={selectedPlanPrice}
                            billingStart={billingStart.toLocaleDateString("en-GB")}
                            billingEnd={billingEnd.toLocaleDateString("en-GB")}
                            planName={selectedPlanName}
                            gstType={companyDetails?.gst_type == "IGST" ? "INTER" : "INTRA"}
                            onTotalsChange={(totals) => {
                                console.log("Invoice calculated totals:", totals);
                                console.log("companyDetails", companyDetails, companyDetails?.gst_type);
                                setInvoiceTotals(totals);
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
            </main>
        </div>
    );
};