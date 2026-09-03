export const plans = [
  {
    id: 1,
    name: "Base",
    price: "Contact us",
    description: "For small teams starting with AI voice agents",
    limits: {
      max_agents: 1,
      max_faqs: 10,
      max_team_members: 2,
      api_access: false,
    },
  },

  {
    id: 2,
    name: "Growth",
    price: "Contact us",
    description: "For growing businesses",
    limits: {
      max_agents: 5,
      max_faqs: 50,
      max_team_members: 10,
      api_access: false,
    },
  },

  {
    id: 3,
    name: "Pro",
    price: "Contact us",
    description: "Advanced automation and integrations",
    limits: {
      max_agents: null,
      max_faqs: null,
      max_team_members: null,
      api_access: true,
    },
  },

  {
    id: 4,
    name: "Custom",
    price: "Contact us",
    description: "Enterprise solutions",
    limits: {
      max_agents: null,
      max_faqs: null,
      max_team_members: null,
      api_access: true,
    },
  },
];