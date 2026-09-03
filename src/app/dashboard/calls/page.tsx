import CallsTable from "@/features/calls/components/CallsTable";


export default function CallsPage() {


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

          Calls

        </h1>



        <p
          className="
            mt-2
            text-gray-500
          "
        >

          View and monitor all AI voice conversations

        </p>


      </div>








      {/* Summary Cards */}


      <div

        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          mb-8
        "

      >






        {/* Total Calls */}

        <div

          className="
            bg-white
            border
            border-orange-100
            rounded-2xl
            p-6
            shadow-sm
            hover:border-orange-300
            transition
          "

        >


          <p
            className="
              text-gray-500
              text-sm
            "
          >

            Total Calls

          </p>


          <h2
            className="
              text-3xl
              font-bold
              mt-2
              text-gray-900
            "
          >

            1240

          </h2>



          <div
            className="
              mt-4
              h-1
              w-16
              rounded-full
              bg-orange-500
            "
          />


        </div>









        {/* Completed */}

        <div

          className="
            bg-white
            border
            border-green-100
            rounded-2xl
            p-6
            shadow-sm
            hover:border-green-300
            transition
          "

        >


          <p
            className="
              text-gray-500
              text-sm
            "
          >

            Completed

          </p>


          <h2

            className="
              text-3xl
              font-bold
              mt-2
              text-gray-900
            "

          >

            1105

          </h2>



          <div

            className="
              mt-4
              h-1
              w-16
              rounded-full
              bg-green-500
            "

          />


        </div>









        {/* Missed */}

        <div

          className="
            bg-white
            border
            border-red-100
            rounded-2xl
            p-6
            shadow-sm
            hover:border-red-300
            transition
          "

        >


          <p

            className="
              text-gray-500
              text-sm
            "

          >

            Missed

          </p>


          <h2

            className="
              text-3xl
              font-bold
              mt-2
              text-gray-900
            "

          >

            135

          </h2>



          <div

            className="
              mt-4
              h-1
              w-16
              rounded-full
              bg-red-500
            "

          />


        </div>





      </div>









      {/* Calls Table */}


      <div

        className="
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

          Recent Conversations

        </h2>




        <CallsTable />



      </div>





    </div>

  );

}