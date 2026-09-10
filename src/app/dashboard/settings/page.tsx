"use client";

import { useEffect, useState } from "react";
import SubscriptionCard from "@/features/subscription/components/SubscriptionCard";
import ApiKeyManager from "@/features/api-keys/components/ApiKeyManager";
import { readStoredOrganisationId } from "@/features/organisations/hooks/useCurrentOrganisation";
import { getSettings, updateProfile } from "@/features/settings/services/settingsServices";
import { storeCurrentUser } from "@/features/auth/utils/authStorage";
import { getApiErrorMessage } from "@/lib/apiError";


export default function SettingsPage() {
  const organisationId = readStoredOrganisationId();


  const [fullName,setFullName] = useState("");

  const [email,setEmail] = useState("");

  const [organisation,setOrganisation] = useState("");

  const [notifications,setNotifications] = useState(true);


  const [saving,setSaving] = useState(false);

  const [message,setMessage] = useState("");

  useEffect(() => {
    if (!organisationId) return;

    const timeout = window.setTimeout(async () => {
      try {
        const data = await getSettings(organisationId);
        setFullName(data.user.full_name ?? "");
        setEmail(data.user.email);
        setOrganisation(data.organisation.name);
      } catch (err) {
        setMessage(getApiErrorMessage(err, "Unable to load settings."));
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [organisationId]);






  const handleSave = async()=>{


    setSaving(true);

    setMessage("");



    try{


      const user = await updateProfile({
        full_name: fullName.trim() || null,
        email: email.trim(),
      });

      storeCurrentUser(user);



      setMessage(
        "Profile changes saved successfully"
      );



    }

    catch(error){


      setMessage(
        getApiErrorMessage(error, "Failed to save profile changes")
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

          readOnly

          onChange={(e)=>
            setOrganisation(e.target.value)
          }

        />




      </div>









      {organisationId && (
        <>
          <div className="bg-white border border-orange-100 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Subscription & Usage</h2>
            <SubscriptionCard organisationId={organisationId} />
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-900">API Keys</h2>
            <ApiKeyManager organisationId={organisationId} />
          </div>
        </>
      )}

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
