"use client";

import React from "react";

export type Company = {
    company_name?: string;
    address1?: string;
    city?: string;
    state?: string;
    pincode?: string | number;
    phone?: string;
    email?: string;
    gstin?: string;
};

export type Plan = {
    name?: string;
    price?: number | string;
    totaluser?: number | string;
};

export type Subscriptions = {
    order_id?: string | number;
    subscription_start?: string;
    subscription_end?: string;
    taxprice?: number | string;
    total?: number | string;
    discount?: number | string;
    paid_amount?: number | string;
    invoice_number?: string | number;
    created?: string;
};

export interface InvoiceProps {
    company: Company;
    Plan: Plan;
    subscriptions: Subscriptions;
}

function toNumber(value: any) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function numberToWords(num: number) {
    const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
        "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen",
        "Eighteen","Nineteen"];
    const b = ["","", "Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

    if (num === 0) return "Zero";
    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
    if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " and " + numberToWords(num % 100) : "");
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");

    return String(num);
}

export default function Invoice({ company = {}, Plan = {}, subscriptions = {} }: InvoiceProps) {
    const price = toNumber(Plan.price);
    const users = toNumber(Plan.totaluser);
    const subtotal = price * (users || 1);
    const discount = toNumber(subscriptions.discount);
    const tax = toNumber(subscriptions.taxprice);
    const total = subtotal - discount + tax;

    const fmt = (n: number) => n.toFixed(2);

    return (
        <div className="max-w-4xl mx-auto bg-white p-10 text-gray-900 border shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <img src="https://ezypayroll.in/images/logo.jpg" alt="Logo" className="h-12" />
                <div className="w-2/3 h-2 bg-red-500"></div>
            </div>

            {/* Invoice By */}
            <div className="flex justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-red-600">Invoice By:</h2>
                    <p className="font-semibold">Doomshell</p>
                    <p className="text-sm whitespace-pre-line">A-3 Mall Road Near Radhy Bakers, Jaipur-303901, Rajasthan</p>
                    <p className="text-sm">GST: 08AAKFD9537B1ZD</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold">Invoice No.</p>
                    <p>{subscriptions.order_id || subscriptions.invoice_number}</p>
                </div>
            </div>

            {/* Billing To */}
            <div className="bg-gray-100 p-4 mb-6">
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-red-600">Billing To:</h2>
                        <p className="font-semibold">{company.company_name}</p>
                        <p className="text-sm">{company.address1}</p>
                        <p className="text-sm">GST: {company.gstin}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">Invoice Date</p>
                        <p>{subscriptions.created}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm mb-6">
                <thead>
                    <tr className="bg-red-500 text-white">
                        <th className="text-left p-2">Description</th>
                        <th className="text-right p-2">Amount (In Rs.)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border">
                        <td className="p-3">
                            <p className="font-semibold">Ezypayroll Software</p>
                            <p>- {users} Users Plan @ Rs. {price}</p>
                            <p>- Billing Period: {subscriptions.subscription_start} to {subscriptions.subscription_end}</p>
                        </td>
                        <td className="text-right p-3 font-semibold">{fmt(subtotal)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
                <div className="text-red-600 font-semibold">Thank you for your Business!</div>
                <div>
                    <div className="flex justify-between text-sm mb-1"><span>Sub Total</span><span>{fmt(subtotal)}</span></div>
                    <div className="flex justify-between text-sm mb-1"><span>Discount</span><span>{fmt(discount)}</span></div>
                    <div className="flex justify-between text-sm mb-1"><span>Tax</span><span>{fmt(tax)}</span></div>
                    <div className="bg-red-500 text-white font-semibold p-2 text-right mt-2">
                        Total Order Value: {fmt(total)}
                    </div>
                </div>
            </div>

            {/* Amount in Words */}
            <div className="flex justify-between mt-10 text-sm">
                <span className="font-semibold">Amount in Words</span>
                <span>{numberToWords(total)} Only</span>
            </div>
        </div>
    );
}
