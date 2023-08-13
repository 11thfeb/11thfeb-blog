const CONFIG = {
  // profile setting (required)
  profile: {
    name: "11thfeb",
    image: "/avatar-11thfeb.png", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "Fullstack Developer & Trader",
    bio: "Welcome to 11thfeb Blog",
    email: "anhbi11o2@gmail.com",
    browser: "https://11thfeb.netlify.com/",
    linkedin: "huu-anh-vo-2154781b5",
    facebook: "11th.feb",
    instagram: "11th.feb",
    github: "11thfeb"
  },
  projects: [
    {
      name: `11thfeb`,
      href: "https://11thfeb.netlify.com/",
    },
  ],
  // blog setting (required)
  blog: {
    title: "11thfeb",
    description: "Welcome to 11thfeb Blog!",
  },

  // CONFIG configration (required)
  link: "https://anna-phan.netlify.app/",
  since: 2022, // If leave this empty, current year will be used.
  lang: "en-US", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: "7f7fe2057c874a698c2dd580771f47b7",
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
      repo: "morethanmin/morethan-log",
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
