'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { PaymentSettingsForm } from "./payment-settings-form";
import { SettingsForm } from "./settings-form";
import { useUser } from "@/hooks/useUser";

export function SettingsTabs() {
    const {isAdmin, isSeller, isCustomer} = useUser()
    return (
        <Tabs defaultValue="store" className="space-y-6 ">
          <TabsList className="grid w-full grid-cols-2">
            {isCustomer && (
              <TabsTrigger value="store">
                  Account info
              </TabsTrigger>
            )}
            {(isSeller || isAdmin) && (
                <TabsTrigger value="store">
                  Store info
              </TabsTrigger>
            )}
            {/* <TabsTrigger value="currency">Store currencies</TabsTrigger> */}
            {(isAdmin || isSeller) && <TabsTrigger value="payment">Payout method</TabsTrigger>}
          </TabsList>
     
            <TabsContent value="store" className="space-y-4 mb-6">
              <SettingsForm />
            </TabsContent>

            {/* <TabsContent value="currency" className="space-y-4">
              <Card className="p-6">
              </Card>
            </TabsContent> */}

            <TabsContent value="payment" className="space-y-4">
              <PaymentSettingsForm />
            </TabsContent>

        </Tabs>
    )
}