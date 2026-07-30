const analytics = [

  {
    title: "Total Conversations",
    value: "3,540",
    description: "All AI handled conversations",
    color: "orange",
  },

  {
    title: "Average Response Time",
    value: "1.8s",
    description: "Average AI response speed",
    color: "blue",
  },

  {
    title: "Customer Satisfaction",
    value: "96%",
    description: "Based on completed calls",
    color: "green",
  },

  {
    title: "Active Voice Agents",
    value: "8",
    description: "Currently running agents",
    color: "orange",
  },

];



const performance = [

  {
    agent: "Front Desk Assistant",
    calls: 245,
    success: "97%",
  },

  {
    agent: "Sales Agent",
    calls: 180,
    success: "91%",
  },

  {
    agent: "Support Agent",
    calls: 95,
    success: "94%",
  },

];



export default function AnalyticsPage() {


  return (

    <div>



      {/* Header */}

      <div className="mb-8">


        <h1
          className="
            text-3xl
            font-bold
            text-gray-900
          "
        >

          Analytics

        </h1>



        <p
          className="
            mt-2
            text-gray-500
          "
        >

          Monitor AI voice platform performance

        </p>


      </div>








      {/* Analytics Cards */}


      <div

        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "

      >



        {
          analytics.map((item)=>(


            <div

              key={item.title}

              className="
                bg-white
                border
                border-orange-100
                rounded-2xl
                p-6
                shadow-sm
                hover:border-orange-300
                hover:shadow-md
                transition
              "

            >



              <p

                className="
                  text-sm
                  text-gray-500
                "

              >

                {item.title}

              </p>





              <h2

                className="
                  text-3xl
                  font-bold
                  mt-3
                  text-gray-900
                "

              >

                {item.value}

              </h2>





              <p

                className="
                  text-sm
                  text-gray-400
                  mt-2
                "

              >

                {item.description}

              </p>






              <div

                className="
                  mt-5
                  h-1
                  w-14
                  rounded-full
                  bg-orange-500
                "

              />


            </div>


          ))

        }



      </div>









      {/* Agent Performance */}


      <div

        className="
          mt-10
          bg-white
          border
          border-orange-100
          rounded-2xl
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

          Agent Performance

        </h2>








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
                  Agent
                </th>


                <th className="pb-4 font-medium">
                  Calls
                </th>


                <th className="pb-4 font-medium">
                  Success Rate
                </th>


              </tr>


            </thead>







            <tbody>


              {
                performance.map((item)=>(


                  <tr

                    key={item.agent}

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

                      {item.agent}

                    </td>




                    <td

                      className="
                        text-gray-700
                      "

                    >

                      {item.calls}

                    </td>





                    <td>


                      <span

                        className="
                          bg-green-100
                          text-green-700
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                        "

                      >

                        {item.success}

                      </span>


                    </td>



                  </tr>


                ))

              }



            </tbody>



          </table>


        </div>





      </div>





    </div>

  );

}