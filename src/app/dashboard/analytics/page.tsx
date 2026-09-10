"use client";

import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";

export default function AnalyticsPage() {
  const { data, loading, error } = useDashboardData();
  const calls = data?.calls ?? [];
  const analytics = data
    ? [
        { title: "Total Conversations", value: data.usage.total_calls, description: "All recorded call summaries" },
        { title: "Calls This Month", value: data.usage.calls_this_month, description: "Recorded call summaries this month" },
        { title: "Active Voice Agents", value: data.agents.filter((agent) => agent.status === "active").length, description: "Currently active agents" },
        { title: "Transfers Required", value: calls.filter((call) => call.transfer_required).length, description: "Calls requiring a transfer" },
      ]
    : [];
  const performance = (data?.agents ?? []).map((agent) => {
    const agentCalls = calls.filter((call) => call.agent_id === agent.id);
    return {
      agent: agent.name,
      calls: agentCalls.length,
      transfers: agentCalls.filter((call) => call.transfer_required).length,
    };
  });
  const dailyCalls = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return {
      label: new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(date),
      count: calls.filter((call) => {
        const createdAt = new Date(call.created_at);
        return createdAt >= date && createdAt < nextDate;
      }).length,
    };
  });
  const highestDailyCallCount = Math.max(...dailyCalls.map((day) => day.count), 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-500">Monitor AI voice platform performance</p>
      </div>

      {error && <p className="mb-6 text-sm text-red-700">{error}</p>}
      {loading && <p className="mb-6 text-sm text-gray-500">Loading analytics...</p>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {analytics.map((item) => (
          <div key={item.title} className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm hover:border-orange-300 hover:shadow-md transition">
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="text-3xl font-bold mt-3 text-gray-900">{item.value}</h2>
            <p className="text-sm text-gray-400 mt-2">{item.description}</p>
            <div className="mt-5 h-1 w-14 rounded-full bg-orange-500" />
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Agent Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-4 font-medium">Agent</th>
                <th className="pb-4 font-medium">Calls</th>
                <th className="pb-4 font-medium">Transfers</th>
              </tr>
            </thead>
            <tbody>
              {performance.map((item) => (
                <tr key={item.agent} className="border-b border-gray-100 hover:bg-orange-50 transition">
                  <td className="py-4 font-medium text-gray-900">{item.agent}</td>
                  <td className="text-gray-700">{item.calls}</td>
                  <td><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">{item.transfers}</span></td>
                </tr>
              ))}
              {!loading && performance.length === 0 && (
                <tr><td colSpan={3} className="py-4 text-sm text-gray-500">No agent performance data yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Calls by Day</h2>
        {!loading && calls.length === 0 ? (
          <p className="text-sm text-gray-500">No call-summary data for the last seven days.</p>
        ) : (
          <div className="flex h-40 items-end justify-between gap-3">
            {dailyCalls.map((day) => (
              <div key={day.label} className="flex flex-1 flex-col items-center gap-2 text-xs text-gray-500">
                <span>{day.count}</span>
                <div className="flex h-24 w-full items-end rounded-sm bg-orange-50">
                  <div
                    className="w-full rounded-sm bg-orange-500"
                    style={{ height: `${(day.count / highestDailyCallCount) * 100}%` }}
                  />
                </div>
                <span>{day.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
