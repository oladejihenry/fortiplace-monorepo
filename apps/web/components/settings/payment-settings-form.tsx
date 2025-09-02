"use client"

import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { createBankAccount } from "@/lib/action/bank";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { useActionState, useEffect, useState, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";

const initialState = {
  message: "",
  errors: {
    bank_code: [],
    bank_account_number: [],
    payment_schedule: [],
  },
};

export function PaymentSettingsForm() {
  const { user, refetchUser } = useUser();
  const [state, formAction, pending] = useActionState(createBankAccount, initialState);
  const [selectedBank, setSelectedBank] = useState(user?.data?.bank_id || "");
  const [paymentSchedule, setPaymentSchedule] = useState(user?.data?.payment_schedule || "");
  const lastMessageRef = useRef("");
  const [open, setOpen] = useState(false);

  // Get banks from user data instead of separate hook
  const availableBanks = user?.data?.availableBanks || [];
  
  // Update selectedBank when user data loads
  useEffect(() => {
    if (user?.data?.bank_id) {
      setSelectedBank(user.data.bank_id);
    }
  }, [user?.data?.bank_id]);
  
  // Handle toast notifications
  useEffect(() => {
    if (state.message && state.message !== lastMessageRef.current) {
      lastMessageRef.current = state.message;
      
      if (state.errors && (
        (state.errors.bank_code && state.errors.bank_code.length > 0) || 
        (state.errors.bank_account_number && state.errors.bank_account_number.length > 0) ||
        (state.errors.payment_schedule && state.errors.payment_schedule.length > 0)
      )) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
        if(state.data) {
          refetchUser();
        }
      }
    }
    
    return () => {
      if (!state.message) {
        lastMessageRef.current = "";
      }
    };
  }, [state, refetchUser]);

  const selectedBankName = availableBanks.find(bank => String(bank.id) === selectedBank)?.name || "Select a bank";
  const selectedBankCode = availableBanks.find(bank => String(bank.id) === selectedBank)?.code || "";

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium">Payout method</h3>
      <p className="text-sm text-muted-foreground">
        Configure your payout method to receive your earnings.
      </p>
      <form action={formAction} className="flex flex-col space-y-8">
        <input type="hidden" name="bank_code" value={selectedBankCode} />
        <input type="hidden" name="bank_id" value={selectedBank} />
        <input type="hidden" name="bank_name" value={selectedBankName} />
        <input type="hidden" name="payment_schedule" value={paymentSchedule} />
        
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="bank-select">Select Bank</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedBankName}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search bank..." />
                  <CommandEmpty>No bank found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {availableBanks.map((bank) => (
                      <CommandItem
                        key={bank.id}
                        value={bank.name}
                        onSelect={() => {
                          setSelectedBank(String(bank.id));
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedBank === String(bank.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {bank.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {state?.errors?.bank_code && state?.errors?.bank_code?.length > 0 && (
              <p className="text-sm text-red-500">{state?.errors?.bank_code[0]}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="account-number">Account Number</Label>
            <Input 
              id="account-number" 
              placeholder="Enter account number" 
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]*"
              name="bank_account_number"
              defaultValue={user?.data?.bank_account_number || ""}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
            />
            {state?.errors?.bank_account_number && state?.errors?.bank_account_number?.length > 0 && (
              <p className="text-sm text-red-500">{state?.errors?.bank_account_number[0]}</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <div className="space-y-1">
            <Label htmlFor="payment-schedule">Payment Schedule</Label>
            <Select value={paymentSchedule} onValueChange={setPaymentSchedule}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment schedule" />
              </SelectTrigger>
              <SelectContent className="w-fit">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {state?.errors?.payment_schedule && state?.errors?.payment_schedule?.length > 0 && (
            <p className="text-sm text-red-500">{state?.errors?.payment_schedule[0]}</p>
          )}
        </div>
        
        {user?.data?.bank_account_name && (
          <div className="flex justify-end mt-4">
            <p className="text-sm text-muted-foreground">
              Account Name: {user?.data?.bank_account_name}
            </p>
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  )
}