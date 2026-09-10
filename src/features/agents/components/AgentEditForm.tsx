"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAgent,
  updateAgent,
} from "../services/agentService";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/lib/apiError";


type AgentStatus = "draft" | "active" | "inactive";


export default function AgentEditForm({
  agentId,
}: {
  agentId: number;
}) {


  const router = useRouter();


  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<AgentStatus>("draft");


  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");




  useEffect(() => {


    const loadAgent = async () => {


      try {


        const agent = await getAgent(agentId);



        setName(agent.name);


        setDescription(
          agent.description ?? ""
        );


        setStatus(
          agent.status as AgentStatus
        );



      } catch(error) {


        setMessage(getApiErrorMessage(error, "Unable to load this agent."));


      }


    };



    loadAgent();



  }, [agentId]);






  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {


    e.preventDefault();


    setLoading(true);

    setMessage("");



    try {


      await updateAgent(

        agentId,

        {

          name,

          description,

          status,

        }

      );



      setMessage(
        "Agent updated successfully"
      );



      setTimeout(() => {


        router.push(
          "/dashboard/voice-agents"
        );


      },1000);




    } catch(error) {


      setMessage(getApiErrorMessage(error, "Failed to update agent"));


    }
    finally {


      setLoading(false);


    }


  };






  return (


    <div
      className="
        max-w-lg
        bg-white
        border
        rounded-xl
        p-6
      "
    >


      {
        message && (

          <p
            className="
              mb-4
              text-sm
            "
          >

            {message}

          </p>

        )
      }





      <form

        onSubmit={handleSubmit}

        className="space-y-4"

      >




        <div>


          <Label>
            Agent Name
          </Label>


          <Input

            value={name}

            onChange={(e)=>
              setName(
                e.target.value
              )
            }

          />


        </div>







        <div>


          <Label>
            Description
          </Label>


          <Input

            value={description}

            onChange={(e)=>
              setDescription(
                e.target.value
              )
            }

          />


        </div>







        <div>


          <Label>
            Status
          </Label>



          <select

            className="
              w-full
              border
              rounded-md
              p-2
            "

            value={status}

            onChange={(e)=>
              setStatus(
                e.target.value as AgentStatus
              )
            }

          >


            <option value="draft">
              Draft
            </option>


            <option value="active">
              Active
            </option>


            <option value="inactive">
              Inactive
            </option>



          </select>



        </div>







        <Button

          type="submit"

          disabled={loading}

          className="w-full"

        >

          {
            loading
            ?
            "Saving..."
            :
            "Save Changes"
          }


        </Button>






      </form>



    </div>


  );


}
