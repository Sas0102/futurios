"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { Loader2, UserRound, Mail, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { signup } from "../services/authService";

// =====================================================
// VALIDATION
// =====================================================

const signupSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

// =====================================================
// ANIMATION VARIANTS
// =====================================================

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.09,
    },
  },
};

const fieldVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const glowVariants: Variants = {
  animate: {
    x: [0, 70, -40, 0],
    y: [0, -50, 30, 0],
    scale: [1, 1.08, 0.95, 1],
    opacity: [0.1, 0.15, 0.08, 0.1],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const smallGlowVariants: Variants = {
  animate: {
    x: [0, -60, 40, 0],
    y: [0, 40, -30, 0],
    scale: [1, 0.9, 1.1, 1],
    opacity: [0.04, 0.08, 0.05, 0.04],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// =====================================================
// SIGNUP FORM
// =====================================================

export default function SignupForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // ===================================================
  // SUBMIT
  // ===================================================

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setErrorMessage("");

    try {
      // Calling backend: POST /signup
      const response = await signup(data);

      console.log("SIGNUP SUCCESS:", response);

      // After successful signup, move user to login page
      router.push("/login");
    } catch (error: any) {
      console.log("SIGNUP ERROR:", error);

      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("Unable to signup. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-4">
      {/* =================================================
          BACKGROUND GRID
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
          bg-[size:48px_48px]
        "
      />

      {/* =================================================
          MAIN ORANGE GLOW
      ================================================= */}

      <motion.div
        variants={glowVariants}
        animate="animate"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/3
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-orange-500/[0.10]
          blur-[140px]
        "
      />

      {/* =================================================
          SECONDARY ORANGE GLOW
      ================================================= */}

      <motion.div
        variants={smallGlowVariants}
        animate="animate"
        className="
          pointer-events-none
          absolute
          right-[10%]
          top-[15%]
          h-[280px]
          w-[280px]
          rounded-full
          bg-orange-400/[0.06]
          blur-[120px]
        "
      />

      {/* =================================================
          FLOATING PARTICLES
      ================================================= */}

      <motion.div
        animate={{
          y: [0, -15, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          left-[20%]
          top-[25%]
          h-1
          w-1
          rounded-full
          bg-orange-400
        "
      />

      <motion.div
        animate={{
          y: [0, 18, 0],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="
          pointer-events-none
          absolute
          right-[22%]
          bottom-[28%]
          h-1.5
          w-1.5
          rounded-full
          bg-orange-500
        "
      />

      <motion.div
        animate={{
          y: [0, -12, 0],
          x: [0, 8, 0],
          opacity: [0.1, 0.35, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="
          pointer-events-none
          absolute
          left-[15%]
          bottom-[20%]
          h-1
          w-1
          rounded-full
          bg-orange-300
        "
      />

      {/* =================================================
          CARD
      ================================================= */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{
          y: -3,
        }}
        transition={{
          duration: 0.25,
        }}
        className="
          relative
          z-10
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.035]
          p-8
          backdrop-blur-2xl
          shadow-[0_20px_80px_rgba(0,0,0,0.65)]
        "
      >
        {/* =================================================
            CARD TOP LIGHT
        ================================================= */}

        <motion.div
          initial={{
            scaleX: 0,
            opacity: 0,
          }}
          animate={{
            scaleX: 1,
            opacity: 1,
          }}
          transition={{
            delay: 0.4,
            duration: 0.8,
            ease: "easeOut",
          }}
          className="
            absolute
            left-1/2
            top-0
            h-px
            w-1/2
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-orange-400
            to-transparent
          "
        />

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div variants={fieldVariants}>
          <motion.div
            whileHover={{
              scale: 1.04,
            }}
            className="
              mb-6
              inline-flex
              items-center
              rounded-full
              border
              border-orange-500/30
              bg-orange-500/[0.08]
              px-4
              py-1.5
              text-[11px]
              uppercase
              tracking-[0.25em]
              text-orange-400
            "
          >
            Get started
          </motion.div>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            Set up your Futurios workspace in under a minute.
          </p>
        </motion.div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.p
              initial={{
                opacity: 0,
                height: 0,
                marginTop: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                height: "auto",
                marginTop: 16,
                y: 0,
              }}
              exit={{
                opacity: 0,
                height: 0,
                marginTop: 0,
                y: -5,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                overflow-hidden
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                px-4
                py-2.5
                text-sm
                text-red-400
              "
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-5"
        >
          {/* =================================================
              FULL NAME
          ================================================= */}

          <motion.div variants={fieldVariants}>
            <Label className="text-xs uppercase tracking-wide text-gray-400">
              Full Name
            </Label>

            <div className="relative mt-1.5">
              <UserRound
                size={16}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <Input
                placeholder="John Doe"
                {...register("full_name")}
                className="
                  h-11
                  border-white/10
                  bg-white/[0.03]
                  pl-9
                  text-white
                  placeholder:text-gray-600
                  transition-all
                  duration-200
                  focus-visible:border-orange-500/50
                  focus-visible:ring-orange-500/20
                "
              />
            </div>

            <AnimatePresence>
              {errors.full_name && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -4,
                  }}
                  className="mt-1.5 text-xs text-red-400"
                >
                  {errors.full_name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <motion.div variants={fieldVariants}>
            <Label className="text-xs uppercase tracking-wide text-gray-400">
              Email
            </Label>

            <div className="relative mt-1.5">
              <Mail
                size={16}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <Input
                placeholder="john@example.com"
                {...register("email")}
                className="
                  h-11
                  border-white/10
                  bg-white/[0.03]
                  pl-9
                  text-white
                  placeholder:text-gray-600
                  transition-all
                  duration-200
                  focus-visible:border-orange-500/50
                  focus-visible:ring-orange-500/20
                "
              />
            </div>

            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -4,
                  }}
                  className="mt-1.5 text-xs text-red-400"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <motion.div variants={fieldVariants}>
            <Label className="text-xs uppercase tracking-wide text-gray-400">
              Password
            </Label>

            <div className="relative mt-1.5">
              <Lock
                size={16}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <Input
                type="password"
                placeholder="********"
                {...register("password")}
                className="
                  h-11
                  border-white/10
                  bg-white/[0.03]
                  pl-9
                  text-white
                  placeholder:text-gray-600
                  transition-all
                  duration-200
                  focus-visible:border-orange-500/50
                  focus-visible:ring-orange-500/20
                "
              />
            </div>

            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -4,
                  }}
                  className="mt-1.5 text-xs text-red-400"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <motion.div variants={fieldVariants}>
            <motion.div
              whileHover={{
                scale: loading ? 1 : 1.01,
              }}
              whileTap={{
                scale: loading ? 1 : 0.98,
              }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="
                  relative
                  mt-1
                  h-11
                  w-full
                  overflow-hidden
                  bg-orange-500
                  font-semibold
                  text-black
                  transition-all
                  duration-200
                  hover:bg-orange-400
                  hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]
                  disabled:opacity-60
                "
              >
                {/* Button shine animation */}

                {!loading && (
                  <motion.span
                    initial={{
                      x: "-120%",
                    }}
                    animate={{
                      x: "120%",
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                    className="
                      pointer-events-none
                      absolute
                      inset-y-0
                      w-1/3
                      -skew-x-12
                      bg-white/20
                    "
                  />
                )}

                {/* Button content */}

                {loading ? (
                  <span className="relative flex items-center justify-center gap-2">
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Creating account...
                  </span>
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    Sign up

                    <motion.span
                      animate={{
                        x: [0, 3, 0],
                      }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      →
                    </motion.span>
                  </span>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>

        {/* =================================================
            FOOTER
        ================================================= */}

        <motion.p
          variants={fieldVariants}
          className="
            mt-7
            text-center
            text-xs
            text-gray-600
          "
        >
          AI-powered voice conversations. Built for business.
        </motion.p>
      </motion.div>
    </main>
  );
}