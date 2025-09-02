import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { NIGERIAN_BANKS } from "@/types/nigerianBanks";
import { formatPrice, getNextPayoutDate } from "@/lib/utils";
import { BanknoteIcon, ArrowDown, Clock, CheckCircle2 } from "lucide-react";
import { User } from "@/types/user";
import { getSales } from "@/lib/action/sales";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { getPayouts } from "@/lib/action/payout";
import { formatDate } from "date-fns";
import { Payout } from "@/types/payout";
interface PayoutDetailsProps {
  user: User;
}

export async function PayoutDetails({ user }: PayoutDetailsProps) {
  const bankName = NIGERIAN_BANKS.find(bank => bank.code === user.data?.bank_code)?.name || "Unknown Bank";
  const accountNumber = user.data?.bank_account_number || "";
  const maskedAccountNumber = accountNumber.replace(/^(\d{6})(\d{4})$/, "$1****");
  
  const sales = await getSales()
  const payoutsResponse = await getPayouts()
  const payouts = payoutsResponse?.payouts.data || []

  const pendingBalance = sales.total_stats.net_earnings || 0;
  // Get the last Friday of the current or next month
  // const getLastFridayOfMonth = (date = new Date()) => {
  //   // Get the last day of the month
  //   const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
  //   // Calculate days to subtract to get to the last Friday
  //   const dayOfWeek = lastDay.getDay(); // 0 = Sunday, 5 = Friday
  //   const daysToSubtract = dayOfWeek < 5 ? dayOfWeek + 2 : dayOfWeek - 5;
    
  //   // Set to the last Friday
  //   lastDay.setDate(lastDay.getDate() - daysToSubtract);
  //   return lastDay;
  // };

  // Get next payout date (last Friday of current month, or next month if we've passed it)
  // const today = new Date();
  // const lastFridayThisMonth = getLastFridayOfMonth();
  const nextPayoutDate = getNextPayoutDate(user?.data?.payment_schedule);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BanknoteIcon className="h-5 w-5" />
            Payout Account
          </CardTitle>
          <CardDescription>
            Your earnings will be sent to this account on {nextPayoutDate.toLocaleDateString()}.
            <Link href="/settings">
              <Button variant="link" className="text-sm text-muted-foreground">
                Update Payout Account
              </Button>
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full">
              <BanknoteIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{bankName}</p>
              <p className="text-sm text-muted-foreground">{maskedAccountNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
      
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Pending Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <div className="text-2xl font-bold">
                {formatPrice(pendingBalance, "NGN")}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold">
                {nextPayoutDate.toLocaleDateString()}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {user?.data?.payment_schedule === 'daily' && 'Processed daily at 2 AM'}
              {user?.data?.payment_schedule === 'weekly' && 'Processed every Monday'}
              {user?.data?.payment_schedule === 'monthly' && 'Processed on the last Friday of each month'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
          <CardDescription>
            History of your recent payouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payouts have been processed yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout: Payout) => (
                <div key={payout.id} className="flex justify-between items-center border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{formatPrice(payout.amount, "NGN")}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payout.created_at, "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {payout.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}