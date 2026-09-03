import { recentCalls } from "../data/dummyData";


export default function RecentCallsTable() {


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
            recentCalls.map((call)=>(


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

                  {call.caller}

                </td>





                <td
                  className="
                    text-gray-700
                  "
                >

                  {call.agent}

                </td>






                <td
                  className="
                    text-gray-700
                  "
                >

                  {call.duration}

                </td>






                <td>


                  <span

                    className={

                      call.status === "Completed"

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

                    {call.status}

                  </span>


                </td>






                <td
                  className="
                    text-gray-700
                  "
                >

                  {call.date}

                </td>





              </tr>


            ))
          }


        </tbody>



      </table>



    </div>

  );

}