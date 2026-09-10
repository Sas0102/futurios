import { CallSummary } from "@/features/calls/types/call";

interface RecentCallsTableProps {
  calls: CallSummary[];
  agentNamesById: Record<number, string>;
}


export default function RecentCallsTable({ calls, agentNamesById }: RecentCallsTableProps) {


  return (

    <div
      className="
        mt-10
        bg-white
        border
        border-orange-100
        rounded-xl
        p-6
        shadow-sm
      "
    >


      <h2
        className="
          text-xl
          font-bold
          mb-6
          text-gray-900
        "
      >
        Recent Calls
      </h2>





      <table className="w-full">


        <thead>


          <tr
            className="
              border-b
              border-gray-200
              text-left
              text-gray-500
            "
          >


            <th className="pb-3">
              Caller
            </th>


            <th>
              Agent
            </th>


            <th>
              Duration
            </th>


            <th>
              Status
            </th>


            <th>
              Date
            </th>


          </tr>


        </thead>






        <tbody>


          {
            calls.map((call)=>(


              <tr

                key={call.id}

                className="
                  border-b
                  border-gray-100
                  hover:bg-orange-50
                  transition
                "

              >



                <td
                  className="
                    py-4
                    text-gray-900
                    font-medium
                  "
                >

                  —

                </td>





                <td
                  className="
                    text-gray-700
                  "
                >

                  {agentNamesById[call.agent_id] ?? `Agent #${call.agent_id}`}

                </td>






                <td
                  className="
                    text-gray-700
                  "
                >

                  —

                </td>






                <td>


                  <span

                    className={

                      !call.transfer_required

                      ?

                      `
                      bg-green-100
                      text-green-700
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-medium
                      `

                      :

                      `
                      bg-red-100
                      text-red-700
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-medium
                      `

                    }

                  >

                  {call.final_intent.replaceAll("_", " ")}

                  </span>


                </td>






                <td
                  className="
                    text-gray-700
                  "
                >

                  {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(call.created_at))}

                </td>





              </tr>


          ))
          }

          {calls.length === 0 && (
            <tr><td colSpan={5} className="py-4 text-sm text-gray-500">No call summaries yet.</td></tr>
          )}


        </tbody>



      </table>



    </div>

  );

}
