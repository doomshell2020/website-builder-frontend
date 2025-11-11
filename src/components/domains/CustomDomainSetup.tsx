"use client";
import { useState } from "react";
import { VercelCore as Vercel } from "@vercel/sdk/core.js";
import { projectsAddProjectDomain } from "@vercel/sdk/funcs/projectsAddProjectDomain.js";
import { projectsGetProjectDomain } from "@vercel/sdk/funcs/projectsGetProjectDomain.js";
import { projectsRemoveProjectDomain } from "@vercel/sdk/funcs/projectsRemoveProjectDomain.js";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface CustomDomainSetupProps { userId: string; }

export default function CustomDomainSetup({ userId }: CustomDomainSetupProps) {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [handleRemoveDomainLoading, setHandleRemoveDomainLoading] = useState(false);
  const [status, setStatus] = useState<{ type: string; message: string }>({
    type: "",
    message: "",
  });
  const [domainInfo, setDomainInfo] = useState<any>(null);
  const [verified, setVerified] = useState<boolean>(false);

  const vercel = new Vercel({
    bearerToken: process.env.NEXT_PUBLIC_VERCEL_TOKEN!,
  });

  const projectId = process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID!;

  // ✅ Add Apex + WWW Domain
  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    const apexDomain = domain.replace(/^www\./, "");
    const wwwDomain = `www.${apexDomain}`;
    setLoading(true);
    setStatus({ type: "", message: "" });
    setVerified(false);
    setDomainInfo(null);

    try {
      // Step 1: Add apex domain
      const apexRes = await projectsAddProjectDomain(vercel, {
        idOrName: projectId,
        requestBody: { name: apexDomain },
      });

      if (!apexRes.ok) {
        const err = JSON.parse(apexRes.error?.body || "{}")?.error;
        if (err?.code === "domain_already_in_use") {
          console.log("Apex already exists:", apexDomain);
        } else {
          throw new Error(err?.message || "Failed to add apex domain");
        }
      }

      // Step 2: Add www domain with redirect
      const wwwRes = await projectsAddProjectDomain(vercel, {
        idOrName: projectId,
        requestBody: {
          name: wwwDomain,
          redirect: apexDomain,
        },
      });

      if (!wwwRes.ok) {
        const err = JSON.parse(wwwRes.error?.body || "{}")?.error;
        if (err?.code === "domain_already_in_use") {
          console.log("WWW already exists:", wwwDomain);
        } else {
          throw new Error(err?.message || "Failed to add www domain");
        }
      }

      // Step 3: Fetch domain info for display
      const infoRes = await projectsGetProjectDomain(vercel, {
        idOrName: projectId,
        domain: apexDomain,
      });

      if (infoRes?.value) {
        setDomainInfo(infoRes.value);
        setVerified(!!infoRes.value.verified);
      }

      setStatus({
        type: "success",
        message: `✅ Both "${apexDomain}" and "www.${apexDomain}" have been added or already exist.`,
      });
    } catch (err: any) {
      console.error("Error:", err);
      setStatus({
        type: "error",
        message: err.message || "Something went wrong while adding the domain.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove Apex + WWW Domain
  const handleRemoveDomain = async () => {
    if (!domain.trim()) return;

    const apexDomain = domain.replace(/^www\./, "");
    const wwwDomain = `www.${apexDomain}`;
    setHandleRemoveDomainLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const apexRes = await projectsRemoveProjectDomain(vercel, {
        idOrName: projectId,
        domain: apexDomain,
      });

      const wwwRes = await projectsRemoveProjectDomain(vercel, {
        idOrName: projectId,
        domain: wwwDomain,
      });

      if (apexRes.ok || wwwRes.ok) {
        setStatus({
          type: "success",
          message: `✅ "${apexDomain}" and "www.${apexDomain}" removed successfully.`,
        });
        setVerified(false);
        setDomainInfo(null);
      } else {
        throw new Error("Failed to remove one or both domains.");
      }
    } catch (err: any) {
      console.error("Error removing domain:", err);
      setStatus({
        type: "error",
        message:
          err.message || "Something went wrong while removing the domain.",
      });
    } finally {
      setHandleRemoveDomainLoading(false);
    }
  };

  // Status Color Helper
  const getStatusColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-300 text-green-700";
      case "warning":
        return "bg-yellow-50 border-yellow-300 text-yellow-700";
      case "error":
        return "bg-red-50 border-red-300 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm max-w-xl mx-auto space-y-5">
      {/* --- Domain Input Form --- */}
      <div className="flex flex-col gap-4">
        <label className="text-sm font-semibold text-gray-700">
          Enter Your Custom Domain
        </label>
        <input
          type="text"
          placeholder="example.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="border border-gray-300 p-3 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddDomain}
            type="button"
            disabled={loading}
            className={`flex-1 ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold py-2 px-4 rounded-md transition`}
          >
            {loading ? "Connecting..." : "Connect Domain"}
          </button>

          <button
            type="button"
            onClick={handleRemoveDomain}
            disabled={handleRemoveDomainLoading || !domain}
            className={`flex-1 ${handleRemoveDomainLoading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
              } text-white font-semibold py-2 px-4 rounded-md transition`}
          >
            {handleRemoveDomainLoading ? "Processing..." : "Remove Domain"}
          </button>
        </div>
      </div>

      {/* --- Status Message --- */}
      {status.message && (
        <div
          className={`border px-4 py-3 rounded-md text-sm font-medium flex items-center gap-2 ${getStatusColor(
            status.type
          )}`}
        >
          {status.type === "success" && <CheckCircle size={18} />}
          {status.type === "warning" && <AlertTriangle size={18} />}
          {status.message}
        </div>
      )}

      {/* --- Domain Info --- */}
      {verified && domainInfo && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-300 p-4 rounded-md text-sm">
            <p className="font-semibold text-green-800">
              Your domain is verified and live!
            </p>
            <p className="text-green-700 mt-1">
              Connected domain: <strong>{domainInfo.name}</strong>
            </p>
            <p className="text-green-700">
              Verified at:{" "}
              {new Date(domainInfo.updatedAt).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="border border-gray-200 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">
              DNS Records (Recommended)
            </h3>
            <table className="min-w-full border border-gray-300 rounded-md text-sm mb-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">A</td>
                  <td className="p-2 border">@</td>
                  <td className="p-2 border">76.76.21.21</td>
                </tr>
                <tr>
                  <td className="p-2 border">CNAME</td>
                  <td className="p-2 border">www</td>
                  <td className="p-2 border">2debca2989ac041b.vercel-dns-017.com.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-gray-200 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">
              Use Vercel DNS
            </h3>
            <ul className="text-sm text-gray-800 border border-gray-300 rounded-md divide-y">
              <li className="p-2">ns1.vercel-dns.com</li>
              <li className="p-2">ns2.vercel-dns.com</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
