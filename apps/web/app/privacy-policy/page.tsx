import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - FortiPlace",
  description: "Privacy Policy for FortiPlace - Learn how we collect, use, and protect your information.",
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background mt-16">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy for FortiPlace</h1>
          <p className="text-muted-foreground mb-8">Last Updated: March 15, 2025</p>

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to FortiPlace (&ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;us&rdquo;). FortiPlace is an online platform that enables creators to sell digital products seamlessly. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://fortiplace.com" className="text-primary hover:text-primary/80">https://fortiplace.com</a> (&ldquo;Site&rdquo;) or use our services (&ldquo;Services&rdquo;). Please read this Privacy Policy carefully. By accessing or using our Site and Services, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">We may collect and process the following types of information:</p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">a. Personal Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><span className="font-medium">Identity Data:</span> Full name, username or similar identifier.</li>
              <li><span className="font-medium">Contact Data:</span> Email address, postal address, and telephone numbers.</li>
              <li><span className="font-medium">Financial Data:</span> Payment card details or other payment information.</li>
              <li><span className="font-medium">Transaction Data:</span> Details about payments to and from you and other details of products you have purchased or sold through our platform.</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">b. Technical Data</h3>
            <p className="text-muted-foreground">
              Internet Protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this Site.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">c. Usage Data</h3>
            <p className="text-muted-foreground">
              Information about how you use our Site and Services, such as page interaction information and referral source.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">d. Marketing and Communications Data</h3>
            <p className="text-muted-foreground">
              Your preferences in receiving marketing from us and your communication preferences.
            </p>
          </section>

          {/* How We Collect Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. How We Collect Information</h2>
            <p className="text-muted-foreground mb-4">We use different methods to collect data from and about you, including through:</p>
            
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <span className="font-medium">Direct Interactions:</span> You may provide us with your Identity, Contact, and Financial Data by filling in forms or by corresponding with us by post, phone, email, or otherwise. This includes personal data you provide when you create an account, subscribe to our Services, or request marketing to be sent to you.
              </li>
              <li>
                <span className="font-medium">Automated Technologies or Interactions:</span> As you interact with our Site, we may automatically collect Technical Data about your equipment, browsing actions, and patterns. We collect this personal data by using cookies, server logs, and other similar technologies.
              </li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            
            <ul className="list-disc pl-6 text-muted-foreground space-y-3">
              <li><span className="font-medium">To Provide and Maintain Our Services:</span> Including processing your transactions, managing your account, and providing customer support.</li>
              <li><span className="font-medium">To Improve Our Services:</span> We may use information about how users interact with our Site to improve our Services and enhance user experience.</li>
              <li><span className="font-medium">To Communicate with You:</span> Regarding your account, transactions, or changes to our terms, conditions, and policies.</li>
              <li><span className="font-medium">For Marketing Purposes:</span> To send you promotional materials about our Services that we believe may be of interest to you. You can opt-out of receiving these communications at any time.</li>
              <li><span className="font-medium">To Comply with Legal Obligations:</span> We may process your personal data to comply with applicable laws, regulations, and legal processes.</li>
            </ul>
          </section>

          {/* Sharing Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Sharing Your Information</h2>
            <p className="text-muted-foreground mb-4">We do not sell or rent your personal data to third parties. However, we may share your data with:</p>
            
            <ul className="list-disc pl-6 text-muted-foreground space-y-3">
              <li><span className="font-medium">Service Providers:</span> Third-party vendors who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.</li>
              <li><span className="font-medium">Business Transfers:</span> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li><span className="font-medium">Legal Requirements:</span> If required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
            </ul>
          </section>

          {/* Cookies and Tracking Technologies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to track activity on our Site and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
            <p className="text-muted-foreground">
              We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. Despite these measures, please be aware that we cannot guarantee absolute security of your data transmitted to our Site; any transmission is at your own risk.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground">
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including satisfying any legal, accounting, or reporting requirements.
            </p>
          </section>

          {/* Your Data Protection Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">9. Your Data Protection Rights</h2>
            <p className="text-muted-foreground mb-4">Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><span className="font-medium">Access:</span> The right to request copies of your personal data.</li>
              <li><span className="font-medium">Rectification:</span> The right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
              <li><span className="font-medium">Erasure:</span> The right to request that we erase your personal data, under certain conditions.</li>
              <li><span className="font-medium">Restrict Processing:</span> The right to request that we restrict the processing of your personal data, under certain conditions.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}