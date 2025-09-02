import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - FortiPlace",
  description: "Contact Us for FortiPlace - Learn how we collect, use, and protect your information.",
}

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-background mt-16">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose prose-invert">
            <h1>Contact Us</h1>
            <p>
                We are here to help you with any questions or concerns you may have.
            </p>
            <p>
                You can contact us by email at <a href="mailto:support@fortiplace.com">support@fortiplace.com</a>.
            </p>
        </div>
      </div>
    </div>
  )
}