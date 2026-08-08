import { Agent } from "@/features/agents/types/agent";

interface AgentStatusProps {
  agents: Agent[];
  callCountsByAgent?: Record<number, number>;
}

const statusLabel = (status: Agent["status"]) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export default function AgentStatus({
  agents,
  callCountsByAgent = {},
}: AgentStatusProps) {
  return (
    <div className="mt-10 rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-gray-900">AI Agent Status</h2>

      {agents.length === 0 ? (
        <p className="text-sm text-gray-500">No voice agents yet.</p>
      ) : (
        <div className="space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:border-orange-300 hover:bg-orange-50"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {callCountsByAgent[agent.id] ?? 0} call summaries
                </p>
              </div>

              <span
                className={
                  agent.status === "active"
                    ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                    : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                }
              >
                {statusLabel(agent.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
