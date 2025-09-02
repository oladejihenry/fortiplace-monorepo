import { Suspense } from "react";
import Loading from "../loading";
import { HandleUpgrade } from "@/components/upgrade/handle-upgrade";

export default async function UpgradePage() {

    return (
        <div className="flex-1 space-y-6 p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Upgrade</h2>
                    </div>
                </div>
                <Suspense fallback={<Loading />}>
                    <HandleUpgrade />
                </Suspense>
            </div>
        </div>
    )
}