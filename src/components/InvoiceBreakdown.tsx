"use client";

import { useState, useMemo, useEffect } from "react";
export default function InvoiceBreakdown({
    companyName, users, pricePerUser, billingStart, billingEnd, planName,
    discount = 0, gstType = "INTRA", onTotalsChange,
}) {
    const [discountType, setDiscountType] = useState("amount");
    const [discountAmount, setDiscountAmount] = useState(0);

    const calculations = useMemo(() => {
        const basePrice = users * pricePerUser;

        let finalDiscount = 0;

        if (discountType === "amount") {
            finalDiscount = discountAmount;
        } else {
            finalDiscount = (basePrice * discountAmount) / 100;
        }

        const taxableAmount = basePrice - finalDiscount;

        const cgst = gstType === "INTRA" ? taxableAmount * 0.09 : 0;
        const sgst = gstType === "INTRA" ? taxableAmount * 0.09 : 0;
        const igst = gstType === "INTER" ? taxableAmount * 0.18 : 0;

        const totalTax = cgst + sgst + igst;
        const subTotal = taxableAmount + totalTax;

        return {
            basePrice,
            discountAmount: finalDiscount,
            cgst,
            sgst,
            igst,
            totalTax,
            subTotal,
        };
    }, [users, pricePerUser, discountAmount, discountType, gstType]);

    // ⭐ Send calculated values to parent on every update
    useEffect(() => {
        if (onTotalsChange) {
            onTotalsChange({
                basePrice: calculations.basePrice,
                discount: calculations.discountAmount,
                cgst: calculations.cgst,
                sgst: calculations.sgst,
                igst: calculations.igst,
                totalTax: calculations.totalTax,
                subTotal: calculations.subTotal,
                perUserRate: pricePerUser,
                totalUsers: users,
                discountType,
                discountInputValue: discountAmount,
            });
        }
    }, [calculations]);

    return (
        <div className="w-full border border-gray-300 rounded-md overflow-hidden mt-4">
            {/* Header */}
            <div className="grid grid-cols-2 bg-[#293042] text-white font-semibold text-sm">
                <div className="p-3">Description</div>
                <div className="p-3 text-right">Amount (in Rs.)</div>
            </div>

            <div className="divide-y divide-gray-200 bg-white text-sm">

                {/* Plan Name */}
                <div className="grid grid-cols-2 p-3">
                    <div className="font-semibold">{companyName}</div>
                </div>

                {/* Users */}
                <div className="grid grid-cols-2 p-3">
                    <div className="text-gray-700">
                        {/* - {users} Users */}
                        Plan @ ₹{pricePerUser} / {planName}
                    </div>
                    <div className="text-right text-gray-800">
                        {calculations.basePrice.toFixed(2)}
                    </div>
                </div>

                {/* Billing */}
                {/* <div className="grid grid-cols-2 p-3">
                    <div className="text-gray-700">
                        - Billing Period: {billingStart} to {billingEnd}
                    </div>
                </div> */}

                {/* Discount */}
                <div className="grid grid-cols-2 p-3 items-center">
                    <div className="text-gray-700 flex items-center gap-2">
                        (•) Discount

                        <select
                            value={discountType}
                            onChange={(e) => {
                                const type = e.target.value;
                                setDiscountType(type);

                                if (type === "percent" && discountAmount > 100) {
                                    setDiscountAmount(100);
                                }
                                if (type === "amount" && discountAmount > calculations.basePrice) {
                                    setDiscountAmount(calculations.basePrice);
                                }
                            }}
                            className="border text-sm px-2 py-1 rounded"
                        >
                            <option value="amount">₹ Amount</option>
                            <option value="percent">% Percent</option>
                        </select>
                    </div>

                    <div className="text-right flex justify-end items-center gap-2">
                        <input
                            type="number"
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
                            placeholder="0"
                            value={discountAmount}
                            onChange={(e) => {
                                let value = Number(e.target.value || 0);

                                if (discountType === "percent") {
                                    if (value > 100) value = 100;
                                } else {
                                    if (value > calculations.basePrice) {
                                        value = calculations.basePrice;
                                    }
                                }

                                setDiscountAmount(value);
                            }}
                        />
                        <span className="text-gray-600">
                            {discountType === "percent" ? "%" : "₹"}
                        </span>
                    </div>
                </div>

                {/* CGST */}
                <div className="grid grid-cols-2 p-3">
                    <div className="text-gray-700">CGST (9%)</div>
                    <div className="text-right text-gray-800">
                        {calculations.cgst.toFixed(2)}
                    </div>
                </div>

                {/* SGST */}
                <div className="grid grid-cols-2 p-3">
                    <div className="text-gray-700">SGST (9%)</div>
                    <div className="text-right text-gray-800">
                        {calculations.sgst.toFixed(2)}
                    </div>
                </div>

                {/* IGST */}
                <div className="grid grid-cols-2 p-3">
                    <div className="text-gray-700">IGST (18%)</div>
                    <div className="text-right text-gray-800">
                        {calculations.igst.toFixed(2)}
                    </div>
                </div>

                {/* Total Tax */}
                <div className="grid grid-cols-2 p-3 font-semibold">
                    <div>Total Tax</div>
                    <div className="text-right">
                        {calculations.totalTax.toFixed(2)}
                    </div>
                </div>

                {/* Sub Total */}
                <div className="grid grid-cols-2 p-3 font-semibold bg-gray-50">
                    <div>Sub Total</div>
                    <div className="text-right">
                        {calculations.subTotal.toFixed(2)}
                    </div>
                </div>

            </div>
        </div>
    );
}
