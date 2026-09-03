import { agents } from "../data/dummyData";


export default function AgentStatus(){


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
        AI Agent Status
      </h2>





      <div
        className="
          space-y-4
        "
      >


        {
          agents.map((agent)=>(


            <div

              key={agent.id}

              className="
                flex
                justify-between
                items-center
                border
                border-gray-200
                rounded-lg
                p-4
                hover:border-orange-300
                hover:bg-orange-50
                transition
              "

            >




              <div>


                <h3
                  className="
                    font-semibold
                    text-gray-900
                  "
                >

                  {agent.name}

                </h3>



                <p
                  className="
                    text-gray-500
                    text-sm
                    mt-1
                  "
                >

                  {agent.calls} calls handled

                </p>


              </div>






              <span

                className={

                  agent.status === "Active"

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
                  bg-gray-100
                  text-gray-700
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-medium
                  `

                }

              >

                {agent.status}

              </span>




            </div>


          ))

        }


      </div>



    </div>

  );

}