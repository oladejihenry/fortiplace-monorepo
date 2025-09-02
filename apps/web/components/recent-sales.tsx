import { AvatarFallback } from "./ui/avatar";

import { AvatarImage } from "./ui/avatar";

import { TableCell } from "./ui/table";

import { TableBody } from "./ui/table";

import { TableHead, TableHeader } from "./ui/table";
import { TableRow } from "./ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Table } from "./ui/table";
import { Avatar } from "./ui/avatar";

export default function RecentSales() {
    const recentSales = [
        { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
        { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
        { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00" },
        { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
        { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00" },
    ]
    return (
        <>
            <Card className="col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[350px]">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {recentSales.map((sale) => (
                            <TableRow key={sale.name}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={sale.name} />
                                    <AvatarFallback>
                                    {sale.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{sale.name}</p>
                                    <p className="text-sm text-muted-foreground">{sale.email}</p>
                                </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">{sale.amount}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}