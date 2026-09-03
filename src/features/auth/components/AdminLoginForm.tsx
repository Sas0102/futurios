"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert } from "lucide-react";

import { login } from "../services/authService";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

      if (!response.user?.is_super_admin) {
        setErrorMessage("This account doesn't have super admin access.");
        setLoading(false);
        return;
      }

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));

      router.push("/admin/organisations");
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8">
      <div className="flex items-center gap-2 mb-1">
        <ShieldAlert size={20} className="text-orange-500" />
        <h1 className="text-2xl font-bold text-white">Super Admin</h1>
      </div>
      <p className="text-sm text-gray-400 mb-8">
        Restricted access — platform administrators only.
      </p>

      {errorMessage && (
        <p className="mb-4 text-sm text-red-400">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            placeholder="admin@futurios.ai"
            {...register("email")}
            className="w-full rounded-lg bg-black border border-white/10 px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500 transition"
          />
          {errors.email && (
            <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            placeholder="********"
            {...register("password")}
            className="w-full rounded-lg bg-black border border-white/10 px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500 transition"
          />
          {errors.password && (
            <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 text-black font-semibold py-2.5 hover:bg-orange-400 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}