"use client"
import { AlertCircle } from "lucide-react";
import { AlertTitle, AlertDescription } from "@workspace/ui/components/alert";
import { Alert } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardAlert() {
    return (
        <Alert className="dark:bg-[#0A0A0A] dark:border-[#1F1F1F] mb-6">
          <AlertCircle className="size-4" />
          <AlertTitle>Setup your payout details</AlertTitle>
          <AlertDescription className="flex items-center justify-between mt-2">
            <span>Start receiving payments by setting up your payout information.</span>
            <Button asChild variant="outline" size="sm">
              <Link href="/settings">
                Setup Payout <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
    )
}