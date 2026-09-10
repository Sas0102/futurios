"use client";

import AgentCard from "./AgentCard";
import { Agent } from "../types/agent";

export default function AgentList({ agents }: { agents: Agent[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          id={agent.id}
          name={agent.name}
          description={agent.description}
          status={agent.status}
        />
      ))}
    </div>
  );
}
