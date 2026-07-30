"use client";

import Link from "next/link";



const agents = [

  {
    id: 1,
    name: "Front Desk Assistant",
    description: "Handles incoming customer calls",
    status: "Active",
  },

  {
    id: 2,
    name: "Sales Agent",
    description: "Handles sales conversations",
    status: "Draft",
  },

];



export default function VoiceAgentsPage() {


  return (

    <div>


      {/* Header */}

      <div
        className="
          flex
          justify-between
          items-center
          mb-8
        "
      >


        <div>


          <h1
            className="
              text-3xl
              font-bold
              text-gray-900
            "
          >

            Voice Agents

          </h1>



          <p
            className="
              text-gray-500
              mt-2
            "
          >

            Manage your AI voice assistants

          </p>


        </div>





        <Link

          href="/dashboard/voice-agents/create"

          className="
            bg-orange-500
            hover:bg-orange-600
            text-white
            px-5
            py-3
            rounded-xl
            font-medium
            transition
            shadow-sm
          "

        >

          + Create Agent

        </Link>



      </div>








      {/* Agent Cards */}


      <div

        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "

      >



        {
          agents.map((agent)=>(


            <div

              key={agent.id}

              className="
                bg-white
                border
                border-orange-100
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-md
                hover:border-orange-300
                transition
              "

            >





              <div
                className="
                  flex
                  justify-between
                  items-start
                "
              >


                <h2

                  className="
                    text-xl
                    font-bold
                    text-gray-900
                  "

                >

                  {agent.name}

                </h2>




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








              <p

                className="
                  text-gray-500
                  mt-3
                  text-sm
                "

              >

                {agent.description}

              </p>









              {/* Agent Stats */}

              <div

                className="
                  mt-5
                  rounded-xl
                  bg-orange-50
                  p-4
                "

              >

                <p

                  className="
                    text-sm
                    text-gray-500
                  "

                >

                  Conversations handled

                </p>


                <p

                  className="
                    text-2xl
                    font-bold
                    text-gray-900
                    mt-1
                  "

                >

                  240

                </p>


              </div>









              {/* Action Buttons */}


              <div

                className="
                  flex
                  gap-3
                  mt-6
                "

              >





                <Link

                  href={`/dashboard/voice-agents/${agent.id}/edit`}

                  className="
                    flex-1
                    text-center
                    border
                    border-orange-200
                    text-orange-600
                    px-4
                    py-2
                    rounded-lg
                    font-medium
                    hover:bg-orange-50
                    transition
                  "

                >

                  Edit

                </Link>







                <Link

                  href={`/dashboard/voice-agents/${agent.id}/test`}

                  className="
                    flex-1
                    text-center
                    bg-gray-900
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    font-medium
                    hover:bg-black
                    transition
                  "

                >

                  Test Voice

                </Link>





              </div>





            </div>


          ))

        }



      </div>




    </div>

  );

}