"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


import { signup } from "../services/authService";



// Validation
const signupSchema = z.object({

  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters"),


  email: z
    .string()
    .email("Please enter a valid email"),


  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

});



type SignupFormData = z.infer<typeof signupSchema>;




export default function SignupForm() {


  const router = useRouter();


  const [loading, setLoading] = useState(false);


  const [errorMessage, setErrorMessage] = useState("");




  const {
    register,
    handleSubmit,
    formState:{
      errors
    }

  } = useForm<SignupFormData>({

    resolver: zodResolver(signupSchema)

  });





  const onSubmit = async (
    data: SignupFormData
  ) => {


    setLoading(true);

    setErrorMessage("");



    try {


      // Calling backend:
      // POST /signup

      const response = await signup(data);



      console.log(
        "SIGNUP SUCCESS:",
        response
      );



      // after successful signup
      // move user to login page

      router.push("/login");



    }

    catch(error:any){


      console.log(
        "SIGNUP ERROR:",
        error
      );



      if(
        error.response?.data?.detail
      ){

        setErrorMessage(
          error.response.data.detail
        );

      }

      else{

        setErrorMessage(
          "Unable to signup. Try again."
        );

      }


    }


    finally{

      setLoading(false);

    }


  };






  return (

    <div className="
      w-full 
      max-w-md 
      rounded-lg 
      border 
      bg-white 
      p-6
    ">



      <h1 className="
        text-2xl 
        font-bold 
        mb-6
      ">
        Create Account
      </h1>





      {
        errorMessage && (

          <p className="
            text-red-500 
            text-sm 
            mb-4
          ">

            {errorMessage}

          </p>

        )
      }





      <form
        onSubmit={
          handleSubmit(onSubmit)
        }

        className="
          space-y-4
        "
      >




        <div>

          <Label>
            Full Name
          </Label>


          <Input

            placeholder="John Doe"

            {...register(
              "full_name"
            )}

          />



          {
            errors.full_name && (

              <p className="
                text-red-500 
                text-sm
              ">

                {
                  errors.full_name.message
                }

              </p>

            )
          }


        </div>







        <div>


          <Label>
            Email
          </Label>


          <Input

            placeholder="john@example.com"

            {...register(
              "email"
            )}

          />



          {
            errors.email && (

              <p className="
                text-red-500 
                text-sm
              ">

                {
                  errors.email.message
                }

              </p>

            )
          }


        </div>







        <div>


          <Label>
            Password
          </Label>


          <Input

            type="password"

            placeholder="********"

            {...register(
              "password"
            )}

          />



          {
            errors.password && (

              <p className="
                text-red-500 
                text-sm
              ">

                {
                  errors.password.message
                }

              </p>

            )
          }


        </div>







        <Button

          type="submit"

          className="
            w-full
          "

          disabled={
            loading
          }

        >


          {
            loading
            ?
            "Creating Account..."
            :
            "Signup"
          }


        </Button>




      </form>



    </div>

  );

}