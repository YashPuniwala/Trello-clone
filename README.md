# 🗂️ Trello Clone

A **full-stack Trello-inspired project management tool** built with **Next.js, PostgreSQL, Prisma, Clerk Authentication, and Stripe**.  
This project replicates Trello-like boards, lists, and cards with authentication, real-time updates, and payments.

---

## 🚀 Features

- 🔑 **Authentication & Organization Management**  
  - Powered by [Clerk](https://clerk.com) for secure sign-in, sign-up, and organization-based access.  

- 🗂️ **Board & List Management**  
  - Create, update, and delete **boards**.  
  - Add multiple **lists** inside each board.  
  - Add, edit, and reorder **cards** inside lists.

- 🎨 **Modern UI**  
  - Built with **Tailwind CSS** & responsive design.  
  - Clean drag-and-drop interface.

- 🖼️ **Image Integration**  
  - Background images fetched dynamically from **Unsplash API**.

- 💳 **Payments**  
  - Stripe integration for handling payments.  
  - Webhooks enabled for real-time updates.

- 🛠️ **Database & ORM**  
  - PostgreSQL with **Prisma ORM**.  
  - Neon.tech cloud-hosted PostgreSQL database.

- 🔔 **Webhooks**  
  - Stripe Webhooks support.  
  - Clerk Authentication webhooks.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** Next.js API Routes
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Image Provider:** [Unsplash API](https://unsplash.com/developers)

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory and add the following:

\`\`\`bash
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_************
CLERK_SECRET_KEY=sk_test_************

# Clerk Redirects
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/select-org
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/select-org
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/select-org
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/select-org

# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require&channel_binding=require"

# Unsplash API
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=************

# Stripe Keys
STRIPE_API_KEY=sk_test_************
STRIPE_WEBHOOK_SECRET=whsec_************

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

⚠️ **Important:**  
- Never commit your real `.env` file to GitHub.  
- Replace \`************\` with your actual keys.  

---

## 📦 Installation & Setup

Clone the repo:

\`\`\`bash
git clone https://github.com/YashPuniwala/Trello-clone.git
cd Trello-clone
\`\`\`

Install dependencies:

\`\`\`bash
npm install
\`\`\`

Run Prisma migrations:

\`\`\`bash
npx prisma generate
npx prisma migrate dev
\`\`\`

Run the development server:

\`\`\`bash
npm run dev
\`\`\`

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Authentication (Clerk)

- Visit [Clerk Dashboard](https://dashboard.clerk.com/) to get your keys.
- Add **sign-in** and **sign-up** URLs in Clerk to match your `.env` values.

---

## 💳 Stripe Setup

1. Get your **Stripe API Key** and **Webhook Secret** from the [Stripe Dashboard](https://dashboard.stripe.com/).
2. Start the Stripe CLI in your project:

   \`\`\`bash
   stripe listen --forward-to localhost:3000/api/webhook
   \`\`\`

3. Copy the Webhook Secret from the CLI output and paste it into `.env`.

---

## 🛠️ Database (PostgreSQL + Prisma)

- This project uses [Neon.tech](https://neon.tech/) PostgreSQL hosting.
- Update your `.env` with the provided \`DATABASE_URL\`.
- Run migrations after making schema changes:

\`\`\`bash
npx prisma migrate dev
\`\`\`

---

## 📸 Screenshots (Optional)

(Add screenshots of your project UI here for better presentation)

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ by **[Yash Puniwala](https://github.com/YashPuniwala)**
