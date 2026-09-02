"use client";

import AgentCard from "./AgentCard";

const dummyAgents = [
  {
    id: 1,
    name: "Front Desk Assistant",
    description: "Handles incoming customer calls",
    status: "active",
  },
  {
    id: 2,
    name: "Sales Agent",
    description: "Handles sales enquiries",
    status: "draft",
  },
  {
    id: 3,
    name: "Support Agent",
    description: "Answers customer support questions",
    status: "active",
  },
];

export default function AgentList() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {dummyAgents.map((agent) => (
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