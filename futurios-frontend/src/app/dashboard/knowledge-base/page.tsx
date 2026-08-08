"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/apiError";
import {
  createFAQ,
  getFAQs,
} from "@/features/knowledge-base/services/faqService";
import { FAQ } from "@/features/knowledge-base/types/faq";
import { useCurrentOrganisation } from "@/features/organisations/hooks/useCurrentOrganisation";

export default function KnowledgeBasePage() {
  const { currentOrganisationId, currentOrganisation, loading, error } =
    useCurrentOrganisation();

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [faqsLoading, setFaqsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [faqError, setFaqError] = useState("");

  const canCreateFAQ = currentOrganisation?.role === "admin";

  const loadFAQs = useCallback(async () => {
    if (!currentOrganisationId) return;

    setFaqsLoading(true);
    setFaqError("");

    try {
      const data = await getFAQs(currentOrganisationId);
      setFaqs(data);
    } catch (err) {
      console.log(err);
      setFaqError("Unable to load FAQs.");
    } finally {
      setFaqsLoading(false);
    }
  }, [currentOrganisationId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadFAQs();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadFAQs]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentOrganisationId) return;

    setMessage("");
    setFaqError("");

    if (!question.trim() || !answer.trim()) {
      setFaqError("Question and answer are required.");
      return;
    }

    setSaving(true);

    try {
      const created = await createFAQ(currentOrganisationId, {
        question: question.trim(),
        answer: answer.trim(),
      });

      setFaqs((current) => [created, ...current]);
      setQuestion("");
      setAnswer("");
      setMessage("FAQ added successfully.");
    } catch (err: unknown) {
      console.log(err);
      setFaqError(getApiErrorMessage(err, "Unable to save FAQ. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="mt-2 text-gray-500">
          Manage the FAQs your receptionist can use during simulations.
        </p>
      </div>

      {loading && (
        <div className="rounded-xl border bg-white p-6 text-gray-500">
          Loading organisation...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !currentOrganisationId && (
        <div className="rounded-xl border bg-white p-6 text-gray-600">
          Create an organisation before adding FAQs.
        </div>
      )}

      {!loading && !error && currentOrganisationId && (
        <div className="space-y-8">
          {canCreateFAQ ? (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-6 text-xl font-bold text-gray-900">Add FAQ</h2>

              {message && (
                <p className="mb-4 rounded-md bg-green-50 p-2 text-sm text-green-700">
                  {message}
                </p>
              )}

              {faqError && (
                <p className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-700">
                  {faqError}
                </p>
              )}

              <div className="space-y-5">
                <div>
                  <Label htmlFor="faq-question">Question</Label>
                  <Input
                    id="faq-question"
                    placeholder="What are your opening hours?"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="faq-answer">Answer</Label>
                  <Textarea
                    id="faq-answer"
                    className="min-h-[120px]"
                    placeholder="We are open Monday to Friday, 9 AM to 5 PM."
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="mt-6" disabled={saving}>
                {saving ? "Saving..." : "Add FAQ"}
              </Button>
            </form>
          ) : (
            <div className="rounded-xl border border-orange-100 bg-white p-6 text-gray-600">
              Only organisation admins can add FAQs.
            </div>
          )}

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">FAQs</h2>

            {faqsLoading && <p className="text-gray-500">Loading FAQs...</p>}

            {!faqsLoading && !faqError && faqs.length === 0 && (
              <p className="text-gray-500">No FAQs have been added yet.</p>
            )}

            {!faqsLoading && faqs.length > 0 && (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
