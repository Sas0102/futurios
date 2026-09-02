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
import { getMyOrganisations } from "@/features/organisations/services/organisationService";
import { storeCurrentOrganisationId } from "@/features/organisations/hooks/useCurrentOrganisation";
import { getApiErrorMessage } from "@/lib/apiError";
import { clearAuthSession, storeAuthSession } from "../utils/authStorage";

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
      clearAuthSession();
      const response = await login(data);

      storeAuthSession(response);

      console.log("Login Successful:", response);

      const organisations = await getMyOrganisations();

      if (organisations.length > 0) {
        storeCurrentOrganisationId(organisations[0].id);
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage(
        getApiErrorMessage(error, "Unable to login. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border bg-white p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Login
      </h1>

      {errorMessage && (
        <p className="mb-4 text-sm text-red-500">
          {errorMessage}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <Label>Email</Label>

          <Input
            placeholder="john@example.com"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label>Password</Label>

          <Input
            type="password"
            placeholder="********"
            {...register("password")}
          />

          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
