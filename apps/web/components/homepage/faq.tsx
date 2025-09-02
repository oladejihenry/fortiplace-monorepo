// import { Button } from "../ui/button";

export default function HomeFAQ() {
  return (
    <section id="faq" className="px-4 py-20 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary/10 to-transparent border p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">How do I start selling on FortiPlace?</h3>
              <p className="text-muted-foreground">
                Getting started is easy! Simply sign up for an account, set up your store profile, and upload your
                digital products. Our user-friendly interface will guide you through the process step-by-step.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-transparent border p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">What types of products can I sell?</h3>
              <p className="text-muted-foreground">
                You can sell a wide range of digital products including ebooks, courses, software, music, art,
                templates, and more. If it&apos;s digital and you own the rights, you can likely sell it on our platform.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-transparent border p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">How do payouts work?</h3>
              <p className="text-muted-foreground">
                We offer payouts last friday of the month. Once a sale is made, the funds (minus our small
                transaction fee) are immediately available in your account for withdrawal to your linked bank account.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-transparent border p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Is there a fee to use FortiPlace?</h3>
              <p className="text-muted-foreground">
                FortiPlace is free to join and list your products. We only charge a small percentage fee (10%) on each sale
                you make. This way, we only make money when you do!
              </p>
            </div>
          </div>
          {/* <div className="text-center mt-12">
            <Button className="bg-primary text-white hover:bg-primary/90">View All FAQs</Button>
          </div> */}
        </div>
      </section>
  );
}