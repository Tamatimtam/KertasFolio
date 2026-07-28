import { NextResponse } from "next/server";

const SLUG_MAP: Record<string, string> = {
  "react": "react",
  "react.js": "react",
  "reactjs": "react",
  "next": "nextdotjs",
  "next.js": "nextdotjs",
  "nextjs": "nextdotjs",
  "typescript": "typescript",
  "ts": "typescript",
  "javascript": "javascript",
  "js": "javascript",
  "node": "nodedotjs",
  "node.js": "nodedotjs",
  "nodejs": "nodedotjs",
  "express": "express",
  "express.js": "express",
  "expressjs": "express",
  "html": "html5",
  "html5": "html5",
  "css": "css3",
  "css3": "css3",
  "python": "python",
  "flask": "flask",
  "django": "django",
  "fastapi": "fastapi",
  "postgresql": "postgresql",
  "postgres": "postgresql",
  "mysql": "mysql",
  "sqlite": "sqlite",
  "mongodb": "mongodb",
  "redis": "redis",
  "clickhouse": "clickhouse",
  "docker": "docker",
  "kubernetes": "kubernetes",
  "k8s": "kubernetes",
  "git": "git",
  "github": "github",
  "gitlab": "gitlab",
  "aws": "amazonwebservices",
  "gcp": "googlecloud",
  "azure": "microsoftazure",
  "tailwind": "tailwindcss",
  "tailwind css": "tailwindcss",
  "tailwindcss": "tailwindcss",
  "vue": "vuedotjs",
  "vue.js": "vuedotjs",
  "vuejs": "vuedotjs",
  "angular": "angular",
  "graphql": "graphql",
  "rest api": "postman",
  "linux": "linux",
  "figma": "figma",
  "java": "openjdk",
  "c++": "cplusplus",
  "c#": "csharp",
  "go": "go",
  "golang": "go",
  "rust": "rust",
  "swift": "swift",
  "kotlin": "kotlin",
  "flutter": "flutter",
  "dart": "dart",
  "sass": "sass",
  "webpack": "webpack",
  "vite": "vite",
  "redux": "redux",
  "jest": "jest",
  "cypress": "cypress",
  "playwright": "playwright",
  "bash": "gnubash",
  "shell": "gnubash",
  "nginx": "nginx",
  "apache": "apache",
  "prisma": "prisma",
  "supabase": "supabase",
  "firebase": "firebase",
  "vercel": "vercel",
};

// SVG Badge generator for unmapped tech keywords
function generateSvgBadge(text: string): string {
  const cleanText = text.trim().slice(0, 3).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect width="16" height="16" rx="3" fill="#2563eb" />
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Helvetica-Bold" font-size="8">${cleanText}</text>
  </svg>`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tech: string }> }
) {
  const { tech } = await params;
  const rawTech = decodeURIComponent(tech || "").trim();
  
  if (!rawTech) {
    return new NextResponse("Missing tech parameter", { status: 400 });
  }

  const normalized = rawTech.toLowerCase();
  
  // 1. Resolve slug from SLUG_MAP (exact or partial word match)
  let slug = SLUG_MAP[normalized];

  if (!slug) {
    for (const [key, value] of Object.entries(SLUG_MAP)) {
      if (normalized.includes(key)) {
        slug = value;
        break;
      }
    }
  }

  // 2. Fetch SVG from Simple Icons CDN if slug matched
  if (slug) {
    try {
      const cdnUrl = `https://cdn.simpleicons.org/${slug}`;
      const res = await fetch(cdnUrl, {
        headers: { "User-Agent": "KertasFolio-CV-App" },
        next: { revalidate: 86400 }, // cache for 24 hours
      });

      if (res.ok) {
        let svgContent = await res.text();

        // Ensure root <svg> tag has width and height for react-pdf compatibility
        if (!/width\s*=/i.test(svgContent)) {
          svgContent = svgContent.replace(/<svg/i, '<svg width="24" height="24"');
        }

        // Propagate root fill color to child tags so react-pdf renders them with correct colors
        const fillMatch = svgContent.match(/<svg[^>]*fill=["']([^"']+)["']/i);
        const fillColor = fillMatch ? fillMatch[1] : null;
        if (fillColor && fillColor !== "none") {
          const tags = ["path", "rect", "circle", "polygon", "ellipse", "line", "polyline", "g"];
          for (const tag of tags) {
            const regex = new RegExp(`<${tag}(?![^>]*fill=)`, "gi");
            svgContent = svgContent.replace(regex, `<${tag} fill="${fillColor}"`);
          }
        }

        return new NextResponse(svgContent, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      }
    } catch (err) {
      console.error(`Error fetching icon SVG for ${slug}:`, err);
    }
  }

  // 3. Fallback: Return generated SVG badge so request never fails or breaks image rendering
  const fallbackSvg = generateSvgBadge(rawTech);
  return new NextResponse(fallbackSvg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
