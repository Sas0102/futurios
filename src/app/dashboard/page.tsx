import StatCard from "@/features/dashboard/components/StatCard";
import RecentCallsTable from "@/features/dashboard/components/RecentCallsTable";
import AgentStatus from "@/features/dashboard/components/AgentStatus";

import { stats } from "@/features/dashboard/data/dummyData";


export default function DashboardPage() {

  return (

    <div>


      {/* Header */}

      <div className="border-l-4 border-primary pl-4">

        <h1 className="
          text-3xl
          font-bold
          text-foreground
        ">
          Dashboard
        </h1>


        <p className="
          mt-2
          text-muted-foreground
        ">
          Monitor your AI Voice Platform
        </p>


      </div>




      {/* Statistics Cards */}

      <div className="
        mt-8
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        xl:grid-cols-4
      ">

        {stats.map((stat) => (

          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
          />

        ))}

      </div>




      {/* Recent Calls */}

      <div className="
        mt-8
        border-t-2
        border-primary/20
        pt-6
      ">

        <RecentCallsTable />

      </div>




      {/* AI Agent Status */}

      <div className="
        mt-8
        border-t-2
        border-primary/20
        pt-6
      ">

        <AgentStatus />

      </div>


    </div>

  );
}