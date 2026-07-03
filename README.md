# Personal CV & Portfolio Website

A responsive, multilingual portfolio and CV site built with Next.js 16 and React 19. It presents my background, selected projects, and skills, and includes two working, interactive features: a live weather widget and a serverless-backed contact form.

The application lives in the [`cv-website-next/`](./cv-website-next) directory.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

**Live site:** https://cv-personal-hazel.vercel.app/

## Overview

The site is a single-page application composed of distinct sections — hero, about, selected work, timeline, skills, and contact — assembled in the App Router. Content is fully internationalized across four languages, the theme adapts to light and dark mode, and interactive elements demonstrate real integrations rather than static mockups. The codebase is fully typed and covered by a Jest test suite.

## Features

- **Responsive layout** — adapts cleanly from mobile to desktop.
- **Light and dark theme** — driven by `next-themes` and CSS custom properties, with the user's choice persisted.
- **Four-language support** — English, German, Russian, and Ukrainian, provided through a React context and persisted in `localStorage`.
- **Live weather widget** — city search with real-time conditions fetched from the Open-Meteo API directly in the browser (no API key required).
- **Working contact form** — messages are delivered by email through the [Resend](https://resend.com) API via a serverless route, with a copy-to-clipboard fallback.
- **Motion and interaction** — scroll-reveal animations, a scroll progress indicator, a custom cursor, and a marquee, implemented with lightweight custom hooks.
- **Typed and tested** — written entirely in TypeScript, with component tests using Jest and React Testing Library.

## Tech Stack

| Area        | Technology                                    |
| ----------- | --------------------------------------------- |
| Framework   | Next.js 16 (App Router), React 19             |
| Language    | TypeScript 5                                  |
| Styling     | Tailwind CSS 4, CSS custom properties         |
| Theming     | next-themes                                   |
| Email       | Resend (serverless API route)                 |
| Testing     | Jest, React Testing Library                   |
| Deployment  | Vercel                                        |

## Project Structure

```text
cv_personal/
└── cv-website-next/          Next.js application
    ├── app/                  App Router
    │   ├── api/contact/      Serverless contact-form route (Resend)
    │   ├── layout.tsx        Root layout and providers
    │   ├── page.tsx          Home page assembling all sections
    │   └── globals.css       Global styles and CSS variables
    ├── components/           Hero, About, Work, Timeline, Skills, Contact,
    │                         LiveWeather, Nav, Footer, and supporting UI
    ├── context/              Language provider (i18n)
    ├── hooks/                useLang, useReveal
    ├── lib/                  translations.ts, skills.ts
    ├── public/               Static assets
    ├── __tests__/            Jest test suites
    └── vercel.json           Deployment configuration
```

## Getting Started

### Prerequisites

- Node.js 20.9 or higher
- A [Resend](https://resend.com) API key, required for the contact form

### Installation

```bash
# Clone the repository
git clone https://github.com/1curafu/cv_personal.git
cd cv_personal/cv-website-next

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Resend credentials

# Start the development server
npm run dev
```

Open http://localhost:3000 to view the site.

### Environment Variables

Create a `.env` file in the `cv-website-next` directory:

```env
# Resend API key — https://resend.com/api-keys
RESEND_API_KEY=your_resend_api_key

# Address that receives contact-form submissions.
# In Resend test mode this must be the account owner's email.
MAIL_TO=your_inbox@example.com

# Sender address. Use the Resend test sender until you verify your own domain.
MAIL_FROM=onboarding@resend.dev
```

The same keys must be configured in the Vercel project settings for the deployed site.

### Available Scripts

Run from the `cv-website-next` directory:

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the development server       |
| `npm run build` | Create a production build          |
| `npm run start` | Serve the production build         |
| `npm run lint`  | Lint the codebase with ESLint      |
| `npm test`      | Run the Jest test suite            |

## Deployment

The site is deployed on Vercel. Pushes to the default branch trigger a production deployment; the required environment variables are configured in the Vercel project settings.

## Contact

- Email: mykhailo.khimich@icloud.com
- GitHub: [@1curafu](https://github.com/1curafu)
- LinkedIn: [Mykhailo Khimich](https://www.linkedin.com/in/mykhailo-khimich-a73a13265/)

## License

This project is licensed under the GNU General Public License. See the [LICENSE](./LICENSE) file for details.
