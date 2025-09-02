// components/admin/orders/manage-orders-header.tsx
'use client'
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export function ManageOrdersHeader() {
    const [search, setSearch] = useQueryState(
        'search',
        parseAsString.withDefault('')
    );
    
    // Remove the default value from useQueryState to ensure changes are always tracked
    const [selectedMonth, setSelectedMonth] = useQueryState(
        'month',
        parseAsString
    );

    // Generate last 12 months for selection
    const getLast12Months = () => {
        const months = [];
        const today = new Date();
        
        for (let i = 0; i < 12; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
                value: format(date, 'yyyy-MM'),
                label: format(date, 'MMMM yyyy')
            });
        }
        
        return months;
    };

    // Get current month in yyyy-MM format
    const currentMonth = format(new Date(), 'yyyy-MM');

    // Use the actual selected month or default to current month if not set
    const effectiveMonth = selectedMonth || currentMonth;

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">Store Sales</h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Select
                    value={effectiveMonth}
                    onValueChange={(value) => {
                        console.log('Setting month to:', value); // Debug log
                        setSelectedMonth(value);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-time">All Time</SelectItem>
                        {getLast12Months().map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                                {month.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input 
                    placeholder="Search by store name or email..."
                    className="max-w-[300px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    )
}