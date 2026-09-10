"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createDemoRequest } from "@/features/admin/services/adminService";
import { getApiErrorMessage } from "@/lib/apiError";

export default function ProductDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormMessage("");

    try {
      await createDemoRequest({
        name: name.trim(),
        email: email.trim(),
        company_name: companyName.trim() || undefined,
        phone_number: phoneNumber.trim() || undefined,
        message: message.trim() || undefined,
      });
      setName("");
      setEmail("");
      setCompanyName("");
      setPhoneNumber("");
      setMessage("");
      setFormMessage("Thanks — we'll be in touch soon.");
    } catch (error) {
      setFormMessage(getApiErrorMessage(error, "Unable to submit your request."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="
        min-h-screen
        bg-black
        px-10
        py-20
        text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-5xl
        "
      >
        <h1
          className="
            text-5xl
            font-bold
          "
        >
          Experience
          <span
            className="
              text-orange-500
            "
          >
            {" "}
            Futurios AI
          </span>{" "}
          Voice Platform
        </h1>

        <p
          className="
            mt-6
            text-lg
            text-gray-400
          "
        >
          Create AI voice agents, monitor conversations, and automate customer
          interactions.
        </p>

        <div
          className="
            mt-12
            rounded-3xl
            border
            border-white/10
            bg-[#111]
            p-10
          "
        >
          <h2
            className="
              text-2xl
              font-bold
            "
          >
            AI Voice Dashboard Preview
          </h2>

          <div
            className="
              mt-8
              grid
              gap-5
              md:grid-cols-3
            "
          >
            <div
              className="
                rounded-xl
                border
                border-white/10
                bg-black
                p-6
              "
            >
              <p className="text-gray-400">
                Calls Today
              </p>

              <h3
                className="
                  mt-2
                  text-4xl
                  font-bold
                "
              >
                1240
              </h3>
            </div>

            <div
              className="
                rounded-xl
                border
                border-white/10
                bg-black
                p-6
              "
            >
              <p className="text-gray-400">
                Active Agents
              </p>

              <h3
                className="
                  mt-2
                  text-4xl
                  font-bold
                "
              >
                24
              </h3>
            </div>

            <div
              className="
                rounded-xl
                border
                border-white/10
                bg-black
                p-6
              "
            >
              <p className="text-gray-400">
                Response Time
              </p>

              <h3
                className="
                  mt-2
                  text-4xl
                  font-bold
                "
              >
                1.2s
              </h3>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 rounded-3xl border border-white/10 bg-[#111] p-10"
        >
          <h2 className="text-2xl font-bold">Request a product demo</h2>
          <p className="mt-2 text-gray-400">
            Tell us a little about your team and we’ll follow up.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white placeholder:text-gray-500"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Work email"
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white placeholder:text-gray-500"
            />
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="Company name (optional)"
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white placeholder:text-gray-500"
            />
            <input
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="Phone number (optional)"
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white placeholder:text-gray-500"
            />
          </div>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="How can Futurios help? (optional)"
            className="mt-5 min-h-28 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white placeholder:text-gray-500"
          />

          {formMessage && (
            <p className="mt-4 text-sm text-gray-300">{formMessage}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-black transition-all duration-200 hover:bg-orange-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Request demo"}
          </button>
        </form>

        <Link
          href="/signup"
          className="
            mt-10
            inline-block
            rounded-xl
            bg-orange-500
            px-8
            py-4
            font-semibold
            text-black
            transition-all
            duration-200
            hover:bg-orange-400
            hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]
          "
        >
          Start Using Futurios
        </Link>
      </div>
    </main>
  );
}
