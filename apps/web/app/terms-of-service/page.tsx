import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | FortiPlace",
  description: "FortiPlace terms of service and legal agreements for creators and customers.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background mt-16">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold mb-8">FortiPlace Terms of Service</h1>
          
          <p className="text-muted-foreground mb-8">
            <strong>Effective Date:</strong> March 15, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to FortiPlace. By accessing our website at{" "}
              <a href="https://fortiplace.com" className="text-[#00A99D] hover:underline">
                https://fortiplace.com
              </a>{" "}
              and using our services, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). 
              Please read these Terms carefully before using our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Platform:</strong> The FortiPlace website and services.</li>
              <li><strong>Creator:</strong> Users who sell digital products through our platform.</li>
              <li><strong>Customer:</strong> Users who purchase digital products from Creators.</li>
              <li><strong>Content:</strong> Digital products, text, images, videos, and other materials uploaded to the platform.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
            <p>To use our services, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 18 years old.</li>
              <li>Register for an account with accurate information.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Notify us immediately of any unauthorized access.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Creator Terms</h2>
            <p>As a Creator, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Only sell digital products you have the right to distribute.</li>
              <li>Provide accurate descriptions of your products.</li>
              <li>Maintain reasonable customer support for your products.</li>
              <li>Accept our revenue-sharing model of 90% to Creator and 10% to Platform.</li>
              <li>Comply with all applicable laws and regulations, including but not limited to the Electronic Transactions Act, 2023, and the Nigerian Data Protection Regulation (NDPR).</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-4">Authorization to Collect Payments</h3>
            <p>
              By listing products on the FortiPlace platform, you (the Creator) expressly authorize FortiPlace to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Collect payments from Customers on your behalf.</li>
              <li>Deduct applicable platform fees and commissions before remitting payouts.</li>
              <li>Facilitate refunds and chargebacks in accordance with our Payment Terms and applicable laws.</li>
            </ul>
            <p>
              You acknowledge that FortiPlace acts as a payment collection agent solely for the limited purpose of accepting payments from Customers on your behalf.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Activities</h2>
            <p>Users may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload or sell illegal or unauthorized content.</li>
              <li>Manipulate the platform&apos;s features or pricing.</li>
              <li>Use the platform for fraudulent purposes.</li>
              <li>Harass other users or our staff.</li>
              <li>Attempt to access other users&apos; accounts.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
            <p>
              All payments are processed securely through our payment providers. Creators will receive payouts according to our payment schedule, subject to minimum payout thresholds.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Refund Policy</h2>
            <p>
              FortiPlace is committed to ensuring customer satisfaction while protecting the rights of our Creators. Our refund policy is designed to be fair and transparent for all parties involved.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-4">7.1 General Refund Policy</h3>
            <p>
              All sales are generally final. However, we may provide refunds in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Technical Issues:</strong> If you cannot access your purchased digital product due to technical problems on our platform that cannot be resolved within 48 hours.</li>
              <li><strong>Misrepresentation:</strong> If the digital product significantly differs from its description or advertised features.</li>
              <li><strong>Duplicate Purchase:</strong> If you accidentally purchase the same product multiple times.</li>
              <li><strong>Creator Fraud:</strong> If we determine that a Creator has engaged in fraudulent activities.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-4">7.2 Refund Request Process</h3>
            <p>To request a refund, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Submit a refund request within 7 days of purchase.</li>
              <li>Provide a detailed explanation of the reason for the refund request.</li>
              <li>Include relevant evidence (screenshots, error messages, etc.) if applicable.</li>
              <li>Contact our support team at <a href="mailto:support@fortiplace.com" className="text-[#00A99D] hover:underline">support@fortiplace.com</a></li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-4">7.3 Refund Processing</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Review Period:</strong> We will review all refund requests within 5-7 business days.</li>
              <li><strong>Approved Refunds:</strong> If approved, refunds will be processed to your original payment method within 7-14 business days.</li>
              <li><strong>Partial Refunds:</strong> In some cases, we may offer partial refunds based on the circumstances.</li>
              <li><strong>Creator Impact:</strong> Approved refunds will result in the reversal of the Creator&apos;s earnings for that transaction.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-4">7.4 Non-Refundable Circumstances</h3>
            <p>Refunds will not be provided in the following situations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Change of mind after successfully accessing the digital product.</li>
              <li>Failure to read the product description before purchase.</li>
              <li>Compatibility issues with your device or software (unless specifically guaranteed).</li>
              <li>Requests made more than 7 days after purchase.</li>
              <li>Products that have been fully downloaded and accessed without technical issues.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-4">7.5 Chargeback Protection</h3>
            <p>
              Initiating a chargeback without first attempting to resolve the issue through our refund process may result in account suspension. We reserve the right to dispute illegitimate chargebacks and may pursue collection of any fees incurred.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p>
              Creators retain their intellectual property rights while granting FortiPlace a license to host and distribute their content. The FortiPlace platform, including its design, logos, and features, is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our discretion. Upon termination, you must cease using our services, and any outstanding payments will be processed according to our payment schedule.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p>
              FortiPlace is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any damages arising from your use of our services or any transactions between users. Our total liability shall not exceed the amounts paid by you for the services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify users of significant changes via email or platform notifications. Continued use of our services after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Dispute Resolution</h2>
            <p>
              Any dispute arising out of or relating to these Terms or the FortiPlace platform shall be resolved through binding arbitration in accordance with the rules of the Lagos Chamber of Commerce International Arbitration Centre (LACIAC).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Severability</h2>
            <p>
              If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck, and the remaining provisions shall be enforced.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between you and FortiPlace with respect to the use of the FortiPlace platform and supersede all prior or contemporaneous communications and proposals, whether oral or written, between you and FortiPlace.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">16. KYC and Enhanced Due Diligence</h2>
            <p>
              In compliance with Nigerian regulations, FortiPlace implements Know Your Customer (KYC) and Enhanced Due Diligence (EDD) procedures for all Creators:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Information Collected:</strong> Full legal name, bank name, phone number, email address, and bank account details.</li>
              <li><strong>Verification:</strong> We verify bank details and ensure that Creators cannot purchase their own products, thereby preventing money laundering activities.</li>
              <li><strong>Compliance:</strong> These measures align with the Money Laundering (Prohibition) Act, 2011, and the Central Bank of Nigeria&apos;s guidelines on KYC and AML/CFT compliance.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">17. Data Protection</h2>
            <p>
              FortiPlace is committed to protecting your personal data in accordance with the Nigerian Data Protection Regulation (NDPR). For more information, please refer to our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">18. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at{" "}
              <a href="mailto:support@fortiplace.com" className="text-[#00A99D] hover:underline">
                support@fortiplace.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}