import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { BanknoteIcon } from "lucide-react";
import Link from "next/link";

export function PayoutAccountPlaceholder() {
  return (
    <Card className="border-dashed border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BanknoteIcon className="h-5 w-5" />
          Set Up Your Payout Account
        </CardTitle>
        <CardDescription>
          You need to set up a payout account to receive payments from your sales
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <div className="text-center space-y-4">
          <div className="bg-muted rounded-full p-6 mx-auto w-fit">
            <BanknoteIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">No Payout Account Set Up</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            To receive payments from your sales, you need to set up a payout account. 
            This will allow us to transfer your earnings directly to your bank account.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Button asChild>
          <Link href="/settings">Set Up Payout Account</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}