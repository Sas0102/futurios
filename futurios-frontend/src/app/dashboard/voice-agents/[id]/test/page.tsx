"use client";

import { use, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { simulateAgentMessage } from "@/features/agents/services/simulationService";
import { SimulateResponse } from "@/features/agents/types/simulation";
import { getApiErrorMessage } from "@/lib/apiError";

interface Exchange {
  caller: string;
  response: SimulateResponse;
}

const createCallId = () => `web-${Date.now()}`;

const formatIntent = (intent: string) =>
  intent
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function VoiceTestPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);
  const agentId = Number(id);

  const [callId, setCallId] = useState(() => createCallId());
  const [message, setMessage] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lastResponse = exchanges[exchanges.length - 1]?.response;

  const statusText = useMemo(() => {
    if (!lastResponse) return "Ready";
    if (lastResponse.end_call) return "Call ended";
    if (lastResponse.transfer_required) return "Transfer required";
    return "In progress";
  }, [lastResponse]);

  const startNewCall = () => {
    setCallId(createCallId());
    setMessage("");
    setExchanges([]);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError("Enter a caller message to simulate.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await simulateAgentMessage(agentId, {
        call_id: callId,
        message: trimmedMessage,
      });

      setExchanges((current) => [
        ...current,
        {
          caller: trimmedMessage,
          response,
        },
      ]);
      setMessage("");
    } catch (err: unknown) {
      console.log(err);
      setError(
        getApiErrorMessage(err, "Unable to run simulation. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Text Simulation</h1>
        <p className="mt-2 text-gray-500">Testing Agent ID: {id}</p>
      </div>

      <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Call ID</p>
            <p className="font-medium text-gray-900">{callId}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {statusText}
            </span>
            <Button type="button" variant="outline" onClick={startNewCall}>
              New Call
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div>
            <Label htmlFor="simulate-message">Caller Message</Label>
            <Textarea
              id="simulate-message"
              className="min-h-[120px]"
              placeholder="Hello, I want to book an appointment tomorrow."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={lastResponse?.end_call}
            />
          </div>

          <Button type="submit" disabled={loading || lastResponse?.end_call}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>

      <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Conversation</h2>

        {exchanges.length === 0 ? (
          <p className="text-sm text-gray-500">No simulation messages yet.</p>
        ) : (
          <div className="space-y-5">
            {exchanges.map((exchange, index) => (
              <div key={`${callId}-${index}`} className="space-y-3">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Caller
                  </p>
                  <p className="mt-2 text-gray-900">{exchange.caller}</p>
                </div>

                <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-xs font-medium uppercase text-orange-500">
                    Receptionist
                  </p>
                  <p className="mt-2 text-gray-900">
                    {exchange.response.response_text}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white px-3 py-1 text-gray-700">
                      Intent: {formatIntent(exchange.response.intent)}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-gray-700">
                      Language: {exchange.response.detected_language}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-gray-700">
                      Confidence: {exchange.response.confidence}
                    </span>
                    {exchange.response.transfer_required && (
                      <span className="rounded-full bg-white px-3 py-1 text-gray-700">
                        Transfer:{" "}
                        {exchange.response.transfer_department ?? "required"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
