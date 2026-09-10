"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/apiError";
import { useCurrentOrganisation } from "@/features/organisations/hooks/useCurrentOrganisation";
import { createFAQ, getFAQs } from "@/features/knowledge-base/services/faqService";
import { FAQ } from "@/features/knowledge-base/types/faq";

export default function KnowledgeBasePage() {
  const { currentOrganisationId, currentOrganisation, loading: organisationLoading, error: organisationError } = useCurrentOrganisation();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadFAQs = useCallback(async () => {
    if (!currentOrganisationId) return;
    setLoading(true);
    setError("");
    try {
      setFaqs(await getFAQs(currentOrganisationId));
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to load FAQs."));
    } finally {
      setLoading(false);
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
    if (!question.trim() || !answer.trim()) {
      setError("Question and answer are required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const created = await createFAQ(currentOrganisationId, { question: question.trim(), answer: answer.trim() });
      setFaqs((current) => [created, ...current]);
      setQuestion("");
      setAnswer("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to add the FAQ."));
    } finally {
      setSaving(false);
    }
  };

  const canCreate = currentOrganisation?.role === "admin";

  return (
    <div>
      <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1><p className="mt-2 text-gray-500">Manage the FAQs your voice agents can use.</p></div>
      {organisationLoading && <p className="text-sm text-gray-500">Loading organisation...</p>}
      {organisationError && <p className="text-sm text-red-700">{organisationError}</p>}
      {!organisationLoading && !organisationError && !currentOrganisationId && <p className="text-sm text-gray-500">Select an organisation to manage FAQs.</p>}
      {currentOrganisationId && <div className="space-y-6">
        {canCreate && <form onSubmit={handleSubmit} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"><h2 className="mb-6 text-xl font-bold text-gray-900">Add FAQ</h2><div className="space-y-5"><div><Label htmlFor="faq-question">Question</Label><Input id="faq-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What are your opening hours?" /></div><div><Label htmlFor="faq-answer">Answer</Label><Textarea id="faq-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} className="min-h-[120px]" placeholder="We are open Monday to Friday, 9 AM to 5 PM." /></div></div><Button type="submit" className="mt-6" disabled={saving}>{saving ? "Saving..." : "Add FAQ"}</Button></form>}
        {!canCreate && <p className="rounded-xl border border-orange-100 bg-white p-6 text-sm text-gray-600">Only organisation admins can add FAQs.</p>}
        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"><h2 className="mb-6 text-xl font-bold text-gray-900">FAQs</h2>{error && <p className="mb-4 text-sm text-red-700">{error}</p>}{loading && <p className="text-sm text-gray-500">Loading FAQs...</p>}{!loading && !error && faqs.length === 0 && <p className="text-sm text-gray-500">No FAQs have been added yet.</p>}{faqs.map((faq) => <div key={faq.id} className="mb-4 rounded-xl border border-gray-200 p-4 last:mb-0"><h3 className="font-semibold text-gray-900">{faq.question}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{faq.answer}</p></div>)}</div>
      </div>}
    </div>
  );
}
