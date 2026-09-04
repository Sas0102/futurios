"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { login } from "../services/authService";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await login(data);

      // Remember me checked -> persist across browser restarts (localStorage)
      // Unchecked -> clears when the tab closes (sessionStorage)
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("access_token", response.access_token);
      storage.setItem("user", JSON.stringify(response.user));

      console.log("Login Successful:", response);

      // Redirect after successful login
      router.push("/onboarding");
    } catch (error: any) {
      console.error("Login Error:", error);

      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage(
          "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">

      {/* =====================================================
          BACKGROUND GRID
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
          [background-size:60px_60px]
        "
      />

      {/* =====================================================
          MAIN ORANGE GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-orange-500/[0.10]
          blur-[150px]
        "
      />

      {/* =====================================================
          TOP ORANGE GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[250px]
          w-[600px]
          -translate-x-1/2
          rounded-full
          bg-orange-500/[0.06]
          blur-[100px]
        "
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-6
          py-12
        "
      >
        <div className="w-full max-w-md">

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-8 text-center">

            <h1
              className="
                text-4xl
                font-semibold
                tracking-[-0.04em]
                text-white
              "
            >
              Welcome back.
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-relaxed
                text-white/50
              "
            >
              Sign in to your AI voice agent platform.
            </p>

          </div>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.10]
              bg-white/[0.045]
              p-7
              shadow-[0_25px_80px_rgba(0,0,0,0.45)]
              backdrop-blur-2xl
              sm:p-8
            "
          >

            {/* Card top orange line */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-0
                h-px
                w-2/3
                -translate-x-1/2
                bg-gradient-to-r
                from-transparent
                via-orange-500/70
                to-transparent
              "
            />

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >

              {/* =================================================
                  ERROR MESSAGE
              ================================================= */}

              {errorMessage && (
                <div
                  className="
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/[0.08]
                    px-4
                    py-3
                  "
                >
                  <p className="text-sm text-red-300">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="space-y-2">

                <Label
                  htmlFor="email"
                  className="
                    text-sm
                    font-medium
                    text-white
                  "
                >
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  autoComplete="email"
                  {...register("email")}
                  className="
                    h-12
                    rounded-xl
                    border
                    border-white/[0.12]
                    bg-black/30
                    px-4
                    text-white
                    placeholder:text-white/25
                    outline-none
                    transition-all

                    focus:border-orange-500/70
                    focus:ring-2
                    focus:ring-orange-500/20

                    /* Chrome / Edge autofill fix */
                    [&:-webkit-autofill]:!bg-transparent
                    [&:-webkit-autofill]:!text-white
                    [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                    [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]
                    [&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_rgba(0,0,0,0.30)_inset]
                  "
                />

                {errors.email && (
                  <p className="text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="space-y-2">

                <Label
                  htmlFor="password"
                  className="
                    text-sm
                    font-medium
                    text-white
                  "
                >
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className="
                    h-12
                    rounded-xl
                    border
                    border-white/[0.12]
                    bg-black/30
                    px-4
                    text-white
                    placeholder:text-white/25
                    outline-none
                    transition-all

                    focus:border-orange-500/70
                    focus:ring-2
                    focus:ring-orange-500/20

                    /* Chrome / Edge autofill fix */
                    [&:-webkit-autofill]:!bg-transparent
                    [&:-webkit-autofill]:!text-white
                    [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                    [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]
                    [&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_rgba(0,0,0,0.30)_inset]
                  "
                />

                {errors.password && (
                  <p className="text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* =================================================
                  REMEMBER ME
              ================================================= */}

              <div className="flex items-center justify-between">

                <label
                  htmlFor="remember-me"
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-2.5
                    text-sm
                    text-white/60
                  "
                >
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="
                      h-4
                      w-4
                      shrink-0
                      cursor-pointer
                      rounded
                      border
                      border-white/20
                      bg-black/30
                      accent-orange-500
                      outline-none
                      focus-visible:ring-2
                      focus-visible:ring-orange-500/30
                    "
                  />
                  Remember me
                </label>

                <a
                  href="/forgot-password"
                  className="
                    text-sm
                    text-orange-400
                    transition-colors
                    hover:text-orange-300
                  "
                >
                  Forgot password?
                </a>

              </div>

              {/* =================================================
                  LOGIN BUTTON
              ================================================= */}

              <Button
                type="submit"
                disabled={loading}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border-0
                  bg-orange-500
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_8px_30px_rgba(249,115,22,0.20)]
                  transition-all
                  duration-300
                  hover:bg-orange-400
                  hover:shadow-[0_8px_35px_rgba(249,115,22,0.30)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {loading ? (
                  <span className="flex items-center gap-2">

                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Logging in...

                  </span>
                ) : (
                  "Log in"
                )}

              </Button>

            </form>

            {/* =================================================
                BOTTOM TEXT
            ================================================= */}

            <div
              className="
                mt-7
                border-t
                border-white/[0.08]
                pt-6
              "
            >
              <p
                className="
                  text-center
                  text-xs
                  text-white/35
                "
              >
                Secure access to your Futurios workspace
              </p>
            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <p
            className="
              mt-7
              text-center
              text-xs
              text-white/25
            "
          >
            AI-powered voice conversations. Built for business.
          </p>

        </div>
      </div>

    </main>
  );
}