
import { CheckoutForm } from "@/components/sites/checkout/checkout-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Checkout",
    description: "Checkout",
}

export default function CheckoutPage() {

    return (
        <div className="flex flex-col lg:flex-row gap-8 py-8">
            <CheckoutForm />
        </div>
    )
}