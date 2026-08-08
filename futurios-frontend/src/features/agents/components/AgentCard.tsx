"use client";

import Link from "next/link";


type AgentCardProps = {
  id: number;
  name: string;
  description: string | null;
  status: string;
};


export default function AgentCard({
  id,
  name,
  description,
  status,
}: AgentCardProps) {


  return (

    <div
      className="
        rounded-2xl
        border
        border-orange-100
        bg-white
        p-6
        shadow-sm
        transition
        hover:shadow-md
        hover:border-orange-300
      "
    >



      {/* Agent Header */}

      <div
        className="
          flex
          justify-between
          items-start
        "
      >

        <div>


          <h2
            className="
              text-xl
              font-bold
              text-gray-900
            "
          >
            {name}
          </h2>



          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            {description || "No description available"}
          </p>


        </div>



        {/* Status */}

        <span

          className={

            status === "active"

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

          {status}

        </span>



      </div>






      {/* Agent Actions */}

      <div
        className="
          mt-6
          flex
          justify-end
          gap-3
        "
      >


        <Link

          href={`/dashboard/voice-agents/${id}/edit`}

          className="
            rounded-lg
            border
            border-orange-200
            px-4
            py-2
            text-sm
            font-medium
            text-orange-600
            hover:bg-orange-50
            transition
          "

        >

          Edit

        </Link>




        <button

          className="
            rounded-lg
            bg-red-500
            px-4
            py-2
            text-sm
            font-medium
            text-white
            hover:bg-red-600
            transition
          "

        >

          Delete

        </button>



      </div>



    </div>

  );

}