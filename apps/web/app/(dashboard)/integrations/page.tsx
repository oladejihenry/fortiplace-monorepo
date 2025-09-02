import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "../loading"
import IntegrationsForm from "@/components/integrations/integrations-form"
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@workspace/ui/components/tabs"
import CustomDomain from "@/components/integrations/custom-domain"
export const metadata: Metadata = {
  title: "Integrations",
  description: "Integrations",
}

export default async function IntegrationsPage() {

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
        </div>
        <Suspense fallback={<Loading />}>
          <IntegrationsTabs />
        </Suspense>
      </div>
    </div>
  )
}

function IntegrationsTabs() {
  return (
    <Tabs defaultValue="integrations" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="integrations">
          Integrations
        </TabsTrigger>
        <TabsTrigger value="custom-domain">
          Store Domain
        </TabsTrigger>
      </TabsList>
      <TabsContent value="integrations" className="space-y-4 mb-6">
        <IntegrationsForm />
      </TabsContent>
      <TabsContent value="custom-domain" className="space-y-4">
        <CustomDomain />
      </TabsContent>
    </Tabs>
  )
}


