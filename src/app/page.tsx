import Link from "next/link";


export default function Home() {

  return (

    <main className="min-h-screen bg-black text-white">


      {/* Navbar */}

      <nav
        className="
          flex
          items-center
          justify-between
          px-10
          py-6
          border-b
          border-white/10
        "
      >


        {/* Logo */}

        <div className="text-2xl font-bold">

          FUTUR<span className="text-orange-500">i</span>OS AI

        </div>





        {/* Navigation */}

        <div
          className="
            hidden
            md:flex
            gap-8
            text-gray-300
          "
        >

          <span>
            Products
          </span>

          <span>
            Solutions
          </span>

          <span>
            Analytics
          </span>

        </div>





        {/* Buttons */}

        <div
          className="
            flex
            gap-4
          "
        >


          <Link

            href="/login"

            className="
              px-5
              py-2
              rounded-lg
              border
              border-white/20
              hover:border-orange-500
              transition
            "

          >

            Login

          </Link>





          <Link

            href="/product-demo"

            className="
              px-5
              py-2
              rounded-lg
              bg-orange-500
              text-black
              font-semibold
              hover:bg-orange-400
              transition
            "

          >

            Get Started

          </Link>



        </div>



      </nav>









      {/* Hero Section */}


      <section
        className="
          grid
          lg:grid-cols-2
          gap-16
          px-10
          py-24
          max-w-7xl
          mx-auto
          items-center
        "
      >




        {/* Left Content */}


        <div>


          <h1
            className="
              text-5xl
              md:text-7xl
              font-bold
              leading-tight
            "
          >

            Build Intelligent


            <span
              className="
                block
                text-orange-500
              "
            >

              AI Voice Agents

            </span>


            for Your Business


          </h1>





          <p
            className="
              mt-8
              text-lg
              text-gray-400
              max-w-xl
            "
          >

            Futurios helps organisations create,
            manage and deploy AI-powered voice
            assistants for customer support,
            sales and automation.


          </p>





          <div
            className="
              flex
              gap-5
              mt-10
            "
          >



            <Link

              href="/product-demo"

              className="
                bg-orange-500
                text-black
                px-8
                py-4
                rounded-xl
                font-semibold
                hover:bg-orange-400
                transition
              "

            >

              Start Building

            </Link>





            <Link

              href="/login"

              className="
                border
                border-white/20
                px-8
                py-4
                rounded-xl
                hover:border-orange-500
                transition
              "

            >

              Login

            </Link>



          </div>



        </div>









        {/* Dashboard Preview */}


        <div
          className="
            bg-[#111]
            border
            border-white/10
            rounded-3xl
            p-8
          "
        >



          <div
            className="
              flex
              justify-between
              mb-8
            "
          >

            <h2 className="text-xl font-bold">

              AI Voice Dashboard

            </h2>


            <span
              className="
                bg-orange-500/20
                text-orange-400
                px-3
                py-1
                rounded-full
                text-sm
              "
            >

              Active

            </span>


          </div>






          <div
            className="
              bg-black
              border
              border-white/10
              rounded-xl
              p-6
            "
          >

            <p className="text-gray-400">

              Calls Today

            </p>


            <h3
              className="
                text-4xl
                font-bold
                mt-2
              "
            >

              1,240

            </h3>


          </div>





          <div
            className="
              grid
              grid-cols-2
              gap-5
              mt-5
            "
          >


            <div
              className="
                bg-black
                border
                border-white/10
                rounded-xl
                p-5
              "
            >

              <p className="text-gray-400">
                Response
              </p>

              <h3 className="text-2xl font-bold">

                1.2s

              </h3>

            </div>





            <div
              className="
                bg-black
                border
                border-white/10
                rounded-xl
                p-5
              "
            >

              <p className="text-gray-400">
                Agents
              </p>


              <h3 className="text-2xl font-bold">

                24

              </h3>


            </div>



          </div>




        </div>



      </section>



    </main>

  );

}