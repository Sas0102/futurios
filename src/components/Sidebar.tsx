import Link from "next/link";


const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "▣",
  },
  {
    name: "Voice Agents",
    href: "/dashboard/voice-agents",
    icon: "◉",
  },
  {
    name: "Calls",
    href: "/dashboard/calls",
    icon: "☎",
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: "▥",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: "⚙",
  },
];


export default function Sidebar() {


  return (

    <aside
      className="
        w-72
        min-h-screen
        bg-white
        border-r
        border-gray-200
        px-6
        py-8
        flex
        flex-col
      "
    >



      {/* Logo */}

      <Link
        href="/"
        className="
          text-3xl
          font-bold
          mb-12
          text-gray-900
          tracking-tight
        "
      >

        Futurios
        <span className="text-orange-500">
          {" "}AI
        </span>

      </Link>





      {/* Navigation */}

      <nav className="space-y-3">


        {
          menuItems.map((item)=>(

            <Link

              key={item.name}

              href={item.href}

              className="
                flex
                items-center
                gap-4
                px-4
                py-3
                rounded-xl
                text-gray-700
                text-base
                font-medium
                transition
                hover:bg-orange-50
                hover:text-orange-600
              "

            >

              <span
                className="
                  text-lg
                "
              >
                {item.icon}
              </span>


              <span>
                {item.name}
              </span>


            </Link>

          ))
        }


      </nav>






      {/* Bottom User Section */}

      <div
        className="
          mt-auto
          border-t
          border-gray-200
          pt-6
        "
      >

        <div
          className="
            rounded-xl
            bg-orange-50
            p-4
          "
        >

          <p
            className="
              font-semibold
              text-gray-900
            "
          >
            Futurios Admin
          </p>


          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            AI Voice Platform
          </p>


        </div>


      </div>




    </aside>

  );

}