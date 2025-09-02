"use client";

import { useState, FormEvent } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Mail } from "lucide-react";

interface VerifyEmailFormProps {
  orderId: string;
}

export function VerifyEmailForm({ orderId }: VerifyEmailFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      //send laravel csrf token
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/downloads/resend-link', {
        order_id: orderId,
        email,
      });
      const { token } = response.data;
      const downloadUrl = response.data.download_url;

      if (token) {
        setSuccess(true);
        setTimeout(() => {
          router.replace(downloadUrl);
        }, 1200); // Show success for a moment before redirect
      } else {
        setError("Invalid email or no download found.");
      }
    } catch {
      setError("Invalid email or no download found.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex mt-10 items-center justify-center bg-background px-4">
      <div
        className=
          "w-full max-w-md bg-card rounded-xl shadow-lg border border-border p-8 flex flex-col items-center"
        
      >
        <Mail className="w-10 h-10 text-primary mb-4" />
        <h1 className="text-2xl font-bold text-center mb-2">
          Enter your email to continue
        </h1>
        <p className="text-muted-foreground text-center mb-6 text-sm">
          For your security, please confirm your email to access your download.
        </p>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className={cn(
              "w-full",
              error && "border-red-500 focus-visible:ring-red-500"
            )}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            aria-label="Email"
            disabled={isLoading || success}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            className="w-full"
            disabled={isLoading || success}
            type="submit"
          >
            {isLoading ? "Verifying..." : "Continue"}
          </Button>
          {success && (
            <p className="text-green-600 text-center text-sm mt-2">
              Email verified! Redirecting to your download...
            </p>
          )}
        </form>
      </div>
    </div>
  );
}