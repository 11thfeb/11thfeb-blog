const CONFIG = {
  // profile setting (required)
  profile: {
    name: "1⃝1⃝🅃🄷 ®",
    image: "/avatar11thfeb.png",
    role: "Site Reliability Engineer",
    bio: "Welcome to 1⃝1⃝🅃🄷 ® Blog",
    telegram: "x11thfeb",
    browser: "https://11thfeb.netlify.app/",
    linkedin: "huu-anh-vo-2154781b5",
    facebook: "11th.feb",
    instagram: "11th.feb",
    github: "11thfeb",
  },
  projects: [
    {
      name: `1⃝1⃝🅃🄷 ®`,
      href: "https://11thfeb.netlify.app/",
    },
  ],
  // blog setting (required)
  blog: {
    title: "1⃝1⃝🅃🄷 ®",
    description: "Welcome to 1⃝1⃝🅃🄷 ® Blog!",
  },

  // CONFIG configration (required)
  link: "https://11thfeb.netlify.app/",
  since: 2022,
  lang: "en-US", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    // pageId: "7f7fe2057c874a698c2dd580771f47b7",
    pageId: "f71df9e666d243388e140dee7e160e6a",
  },
  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: false,
    config: {
      repo: "11thfeb/PostgreSQL",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 60, // revalidate time for [slug], index
}

module.exports = { CONFIG }
