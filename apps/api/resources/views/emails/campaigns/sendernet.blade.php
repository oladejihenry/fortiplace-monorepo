<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Feature: Coupons</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8f9fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #222;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 24px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }
    h1 {
      font-size: 20px;
      margin-bottom: 10px;
      color: #111827;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      margin: 8px 0;
    }
    .highlight {
      color: #2563eb;
      font-weight: bold;
    }
    .image {
      margin-top: 16px;
      text-align: center;
    }
    .image img {
      max-width: 100%;
      border-radius: 8px;
    }
    .feature-box {
        background-color: #f0f8ff; /* Light blue background */
        padding: 16px 18px;
        border-radius: 8px;
        font-family: Arial, Helvetica, sans-serif;
        max-width: 600px;
    }

    .feature-title {
        font-size: 16px;
        font-weight: bold;
        color: #1f2937; /* Dark gray */
        margin: 0 0 6px 0;
    }

    .feature-subtext {
        font-size: 14px;
        color: #374151; /* Medium gray */
        margin: 0;
        line-height: 1.5;
    }

    .footer {
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      margin-top: 30px;
      line-height: 1.6;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
    @media screen and (max-width: 600px) {
      .container {
        padding: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hi {{username}},</h1>

    <p>We're excited to introduce a <span class="highlight">new feature</span> based on your feedback! 🎉</p>

    <div class="feature-box">
        <p class="feature-title">🆕 View Product Online (PDF only)</p>
        <p class="feature-subtext">
            You can now let customers <strong>view PDF products directly online</strong> without needing to download them. 🎯
        </p>
    </div>


    <p><strong>Note:</strong> This feature is currently available only for the
      <span class="highlight">Nigeria Naira (NGN)</span> payment method. We'll expand to other payment methods soon!
    </p>

    <!-- First Image -->
    <div class="image">
      <img src="https://cdn.fortiplacecdn.com/email-images/Screenshot%202025-09-03%20at%2009.05.39.png" alt="Coupon Creation Screenshot" />
    </div>
    
    <p>
      In the image above, simply enter the coupon code you want customers to use, select the discount type (<strong>Fixed</strong> or <strong>Percentage</strong>), enter the discount amount, and choose the expiry date and time. Then click on the <strong>Create Coupon</strong> button.
    </p>
    
    <!-- Second Image -->
    <div class="image">
      <img src="https://cdn.fortiplacecdn.com/email-images/Screenshot%202025-09-03%20at%2009.05.59.png" alt="Coupon List Screenshot" />
    </div>
    
    <p>
      After creating a coupon, you can copy the code and share it with your customers. They can then apply it during checkout to get instant discounts.
    </p>

    <!-- Third Image -->
    <div class="image">
      <img src="https://cdn.fortiplacecdn.com/email-images/Screenshot%202025-09-03%20at%2009.06.59.png" alt="Checkout Page Coupon Screenshot" />
    </div>
    
    <!-- Fourth Image -->
    <div class="image">
      <img src="https://cdn.fortiplacecdn.com/email-images/Screenshot%202025-09-03%20at%2009.06.37.png" alt="Coupon Applied Screenshot" />
    </div>

    <p style="margin-top: 20px;">
      We hope this helps you give your customers a better shopping experience. 🚀
    </p>

    <p style="margin-top: 24px;">– The Fortiplace Team</p>

    <!-- Footer -->
    <div class="footer">
      <p>
        You're receiving this email because you're a registered creator on Fortiplace.<br>
        © 2025 Fortiplace • <a href="{{unsubscribe_url}}">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
