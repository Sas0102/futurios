import { CallSummary } from "@/features/calls/types/call";

interface RecentCallsTableProps {
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

export default function RecentCallsTable({
  calls,
  agentNamesById = {},
}: RecentCallsTableProps) {
  return (
    <div className="mt-10 rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-gray-900">Recent Calls</h2>

      {calls.length === 0 ? (
        <p className="text-sm text-gray-500">No call summaries yet.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3">Call ID</th>
              <th>Agent</th>
              <th>Intent</th>
              <th>Transfer</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {calls.slice(0, 5).map((call) => (
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
                <td className="text-gray-700">
                  {formatIntent(call.final_intent)}
                </td>
                <td>
                  <span
                    className={
                      call.transfer_required
                        ? "rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700"
                        : "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                    }
                  >
                    {call.transfer_required ? "Required" : "No"}
                  </span>
                </td>
                <td className="text-gray-700">{formatDate(call.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
