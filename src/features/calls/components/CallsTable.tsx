import { dummyCalls } from "../data/dummyCalls";


export default function CallsTable(){


  return (

    <div className="overflow-x-auto">


      <table
        className="
          w-full
          text-sm
        "
      >


        <thead>


          <tr
            className="
              border-b
              border-gray-200
              text-left
              text-gray-500
            "
          >


            <th className="pb-4 font-medium">
              Caller
            </th>


            <th className="pb-4 font-medium">
              Agent
            </th>


            <th className="pb-4 font-medium">
              Duration
            </th>


            <th className="pb-4 font-medium">
              Status
            </th>


            <th className="pb-4 font-medium">
              Date
            </th>


          </tr>


        </thead>





        <tbody>


          {
            dummyCalls.map((call)=>(


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
                    font-medium
                    text-gray-900
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
                      text-xs
                      font-medium
                      `

                      :

                      `
                      bg-red-100
                      text-red-700
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      `

                    }

                  >

                    {call.status}

                  </span>


                </td>







                <td
                  className="
                    text-gray-500
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