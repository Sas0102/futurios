"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BookDemoCard() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company_name: "",
    phone_number: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email) {
      setStatus("error");
      setErrorMsg("Name and email are required.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/demo-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-orange-500/30 bg-white/[0.03] backdrop-blur-sm p-8 text-center max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-white">You're all set 🎉</h3>
        <p className="mt-3 text-gray-400">
          Thanks — we've got your request. Someone from our team will reach out shortly to schedule your demo.
        </p>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 max-w-md mx-auto"
    >
      <h3 className="text-2xl font-bold text-white">Book a Demo</h3>
      <p className="mt-2 text-sm text-gray-400">
        Tell us a bit about you and we'll set up a time to walk you through Futurios.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Name <span className="text-orange-500">*</span>
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg bg-black border border-white/10 px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500 transition"
            placeholder="Jane Smith"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Email <span className="text-orange-500">*</span>
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg bg-black border border-white/10 px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500 transition"
            placeholder="jane@company.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Company</label>
          <input
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            className="w-full rounded-lg bg-black border border-white/10 px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500 transition"
            placeholder="Acme Inc."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Phone</label>
          <input
            value={form.phone_number}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            className="w-full rounded-lg bg-black border border-white/10 px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500 transition"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={3}
            className="w-full rounded-lg bg-black border border-white/10 px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500 transition resize-none"
            placeholder="What are you hoping to solve with Futurios?"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "mt-6 w-full"
        )}
      >
        {status === "loading" ? "Submitting..." : "Request Demo"}
      </button>
    </motion.form>
  );
}