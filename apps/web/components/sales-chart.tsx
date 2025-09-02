import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function SalesChart() {
    return (
        <>
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Sales Chart</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                    {/* Replace with actual chart component */}
                    <div className="flex h-full items-center justify-center bg-muted">Chart Placeholder</div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}