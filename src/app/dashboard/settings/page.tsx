"use client";

import { useState } from "react";


export default function SettingsPage() {


  const [fullName,setFullName] = useState("Saswati");

  const [email,setEmail] = useState("user@example.com");

  const [organisation,setOrganisation] = useState("Futurios AI");

  const [notifications,setNotifications] = useState(true);


  const [saving,setSaving] = useState(false);

  const [message,setMessage] = useState("");






  const handleSave = async()=>{


    setSaving(true);

    setMessage("");



    try{


      console.log({

        fullName,

        email,

        organisation,

        notifications

      });



      setMessage(
        "Changes saved successfully"
      );



    }

    catch(error){


      setMessage(
        "Failed to save changes"
      );


    }

    finally{


      setSaving(false);


    }



  };







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

          Settings

        </h1>



        <p

          className="
            mt-2
            text-gray-500
          "

        >

          Manage your account and organisation settings

        </p>


      </div>









      {/* Profile Section */}


      <div

        className="
          bg-white
          border
          border-orange-100
          rounded-2xl
          p-6
          mb-6
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

          Profile

        </h2>





        <div className="space-y-5">





          <div>


            <label

              className="
                text-sm
                text-gray-500
              "

            >

              Full Name

            </label>



            <input

              className="
                mt-2
                w-full
                border
                border-gray-200
                rounded-xl
                p-3
                outline-none
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
              "

              value={fullName}

              onChange={(e)=>
                setFullName(e.target.value)
              }

            />


          </div>









          <div>


            <label

              className="
                text-sm
                text-gray-500
              "

            >

              Email

            </label>



            <input

              className="
                mt-2
                w-full
                border
                border-gray-200
                rounded-xl
                p-3
                outline-none
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
              "

              value={email}

              onChange={(e)=>
                setEmail(e.target.value)
              }

            />


          </div>



        </div>


      </div>









      {/* Organisation Section */}



      <div

        className="
          bg-white
          border
          border-orange-100
          rounded-2xl
          p-6
          mb-6
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

          Organisation

        </h2>





        <label

          className="
            text-sm
            text-gray-500
          "

        >

          Organisation Name

        </label>




        <input

          className="
            mt-2
            w-full
            border
            border-gray-200
            rounded-xl
            p-3
            outline-none
            focus:border-orange-500
            focus:ring-2
            focus:ring-orange-100
          "

          value={organisation}

          onChange={(e)=>
            setOrganisation(e.target.value)
          }

        />




      </div>









      {/* Preferences */}



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

          Preferences

        </h2>







        <div

          className="
            flex
            justify-between
            items-center
            border
            border-gray-200
            rounded-xl
            p-4
          "

        >



          <div>


            <h3

              className="
                font-semibold
                text-gray-900
              "

            >

              Notifications

            </h3>



            <p

              className="
                text-sm
                text-gray-500
              "

            >

              Receive alerts for calls and system updates

            </p>


          </div>







          <button

            onClick={()=>
              setNotifications(!notifications)
            }


            className={`

              px-5
              py-2
              rounded-xl
              text-white
              font-medium
              transition

              ${
                notifications
                ?
                "bg-orange-500 hover:bg-orange-600"
                :
                "bg-gray-400"
              }

            `}

          >


            {

              notifications
              ?
              "ON"
              :
              "OFF"

            }


          </button>




        </div>









        <button

          onClick={handleSave}

          disabled={saving}

          className="
            mt-6
            bg-orange-500
            hover:bg-orange-600
            text-white
            px-6
            py-3
            rounded-xl
            font-medium
            transition
            disabled:opacity-50
          "

        >


          {

            saving
            ?
            "Saving..."
            :
            "Save Changes"

          }


        </button>







        {

          message && (

            <p

              className="
                mt-4
                text-green-600
                text-sm
              "

            >

              {message}

            </p>

          )

        }



      </div>





    </div>

  );

}