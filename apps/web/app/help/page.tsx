import { Metadata } from "next"
import { Search } from "lucide-react"
import { Input } from "@workspace/ui/components/input"

export const metadata: Metadata = {
  title: "Help Center - FortiPlace",
  description: "Get help with using FortiPlace. Find answers to common questions and learn how to use our platform.",
}

export default function HelpCenter() {
  const categories = [
    {
      title: "Getting Started",
      articles: [
        { title: "How to create an account", link: "#" },
        { title: "Setting up your store", link: "#" },
        { title: "Adding your first product", link: "#" },
      ]
    },
    {
      title: "Payments",
      articles: [
        { title: "Setting up payouts", link: "#" },
        { title: "Payment methods", link: "#" },
        { title: "Transaction fees", link: "#" },
      ]
    },
    {
      title: "Products",
      articles: [
        { title: "Product guidelines", link: "#" },
        { title: "Managing inventory", link: "#" },
        { title: "Product pricing", link: "#" },
      ]
    },
    {
      title: "Account Management",
      articles: [
        { title: "Account settings", link: "#" },
        { title: "Security features", link: "#" },
        { title: "Verification process", link: "#" },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-background mt-16">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Search our help center or browse categories below
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search help articles..."
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {categories.map((category) => (
            <div key={category.title} className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
              <ul className="space-y-3">
                {category.articles.map((article) => (
                  <li key={article.title}>
                    <a 
                      href={article.link}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {article.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
          <p className="text-muted-foreground mb-8">
            Our support team is available to assist you
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}