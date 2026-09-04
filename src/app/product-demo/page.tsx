import Link from "next/link";

export default function ProductDemo() {
  return (
    <main
      className="
        min-h-screen
        bg-black
        px-10
        py-20
        text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-5xl
        "
      >
        <h1
          className="
            text-5xl
            font-bold
          "
        >
          Experience
          <span
            className="
              text-orange-500
            "
          >
            {" "}
            Futurios AI
          </span>{" "}
          Voice Platform
        </h1>

        <p
          className="
            mt-6
            text-lg
            text-gray-400
          "
        >
          Create AI voice agents, monitor conversations, and automate customer
          interactions.
        </p>

        <div
          className="
            mt-12
            rounded-3xl
            border
            border-white/10
            bg-[#111]
            p-10
          "
        >
          <h2
            className="
              text-2xl
              font-bold
            "
          >
            AI Voice Dashboard Preview
          </h2>

          <div
            className="
              mt-8
              grid
              gap-5
              md:grid-cols-3
            "
          >
            <div
              className="
                rounded-xl
                border
                border-white/10
                bg-black
                p-6
              "
            >
              <p className="text-gray-400">
                Calls Today
              </p>

              <h3
                className="
                  mt-2
                  text-4xl
                  font-bold
                "
              >
                1240
              </h3>
            </div>

            <div
              className="
                rounded-xl
                border
                border-white/10
                bg-black
                p-6
              "
            >
              <p className="text-gray-400">
                Active Agents
              </p>

              <h3
                className="
                  mt-2
                  text-4xl
                  font-bold
                "
              >
                24
              </h3>
            </div>

            <div
              className="
                rounded-xl
                border
                border-white/10
                bg-black
                p-6
              "
            >
              <p className="text-gray-400">
                Response Time
              </p>

              <h3
                className="
                  mt-2
                  text-4xl
                  font-bold
                "
              >
                1.2s
              </h3>
            </div>
          </div>
        </div>

        <Link
          href="/signup"
          className="
            mt-10
            inline-block
            rounded-xl
            bg-orange-500
            px-8
            py-4
            font-semibold
            text-black
            transition-all
            duration-200
            hover:bg-orange-400
            hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]
          "
        >
          Start Using Futurios
        </Link>
      </div>
    </main>
  );
}