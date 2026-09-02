import { CallSummary } from "../types/call";

interface CallsTableProps {
  calls: CallSummary[];
  agentNamesById?: Record<number, string>;
}

const formatIntent = (intent: string) =>
  intent
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function CallsTable({
  calls,
  agentNamesById = {},
}: CallsTableProps) {
  if (calls.length === 0) {
    return <p className="text-sm text-gray-500">No call summaries yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="pb-4 font-medium">Call ID</th>
            <th className="pb-4 font-medium">Agent</th>
            <th className="pb-4 font-medium">Intent</th>
            <th className="pb-4 font-medium">Turns</th>
            <th className="pb-4 font-medium">Transfer</th>
            <th className="pb-4 font-medium">Created</th>
          </tr>
        </thead>

        <tbody>
          {calls.map((call) => (
            <tr
              key={call.id}
              className="border-b border-gray-100 transition hover:bg-orange-50"
            >
              <td className="py-4 font-medium text-gray-900">
                {call.call_id}
              </td>
              <td className="text-gray-700">
                {agentNamesById[call.agent_id] ?? `Agent #${call.agent_id}`}
              </td>
              <td className="text-gray-700">{formatIntent(call.final_intent)}</td>
              <td className="text-gray-700">{call.turn_count}</td>
              <td>
                <span
                  className={
                    call.transfer_required
                      ? "rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700"
                      : "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                  }
                >
                  {call.transfer_required
                    ? call.transfer_department ?? "Required"
                    : "Not required"}
                </span>
              </td>
              <td className="text-gray-500">{formatDate(call.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
