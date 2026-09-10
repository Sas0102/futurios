"use client";

import { use, useRef, useState } from "react";
import { sendAgentVoiceSession, simulateAgent, startAgentTestSession } from "@/features/agents/services/agentService";
import { getApiErrorMessage } from "@/lib/apiError";

export default function VoiceTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agentId = Number(id);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState("");
  const [simulationMessage, setSimulationMessage] = useState("");
  const [simulationResponse, setSimulationResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const showError = (err: unknown, fallback: string) => setError(getApiErrorMessage(err, fallback));

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      audioChunks.current = [];
      recorder.ondataavailable = (event) => audioChunks.current.push(event.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const recordedAudio = new Blob(audioChunks.current, { type: "audio/webm" });
        setAudioBlob(recordedAudio);
        setAudioURL(URL.createObjectURL(recordedAudio));
      };
      recorder.start();
      setRecording(true);
    } catch (err) {
      showError(err, "Microphone access is required to record audio.");
    }
  };

  const runRequest = async (request: () => Promise<string>, fallback: string) => {
    setLoading(true);
    setError("");
    try {
      setTranscript(await request());
    } catch (err) {
      showError(err, fallback);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    if (!simulationMessage.trim()) {
      setError("Enter a message to simulate.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await simulateAgent(agentId, { call_id: crypto.randomUUID(), message: simulationMessage.trim() });
      setSimulationResponse(result.response_text);
    } catch (err) {
      showError(err, "Unable to simulate this agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Voice Test</h1>
      <p className="text-gray-500">Testing Agent ID: {id}</p>
      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <button onClick={recording ? () => { mediaRecorder.current?.stop(); setRecording(false); } : startRecording} className="bg-black text-white px-6 py-3 rounded-lg">
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && <div className="space-y-4">
        <h2 className="font-semibold">Your Recording</h2>
        <audio controls src={audioURL} />
        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-60" disabled={loading} onClick={() => audioBlob && runRequest(async () => (await sendAgentVoiceSession(agentId, audioBlob)).transcript ?? "The voice session completed without a transcript.", "Unable to send the recording.")}>Send Recording</button>
      </div>}
      <button className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-60" disabled={loading} onClick={() => runRequest(async () => (await startAgentTestSession(agentId)).transcript ?? "The test session completed without a transcript.", "Unable to run the agent test.")}>{loading ? "Testing..." : "Run Agent Test"}</button>
      <div className="space-y-3 border rounded-lg p-4">
        <h2 className="font-semibold">Simulate Conversation</h2>
        <textarea value={simulationMessage} onChange={(event) => setSimulationMessage(event.target.value)} className="w-full rounded-lg border p-2" placeholder="Type a caller message" />
        <button onClick={runSimulation} disabled={loading} className="bg-gray-900 text-white px-5 py-2 rounded-lg disabled:opacity-60">Simulate Response</button>
        {simulationResponse && <p>{simulationResponse}</p>}
      </div>
      {transcript && <div className="border rounded-lg p-4"><h2 className="font-semibold">Transcript</h2><p>{transcript}</p></div>}
    </div>
  );
}
