import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CACHE_PATH = path.join(process.cwd(), "data", "icon_cache.json");

const getPredefinedDomain = (tech: string): string | null => {
  const name = tech.toLowerCase().trim();
  const map: Record<string, string> = {
    "html": "html.com",
    "css": "css3.info",
    "python": "python.org",
    "flask": "flask.palletsprojects.com",
    "postgresql": "postgresql.org",
    "sqlite": "sqlite.org",
    "clickhouse": "clickhouse.com",
    "redis": "redis.io",
    "mqtt": "mqtt.org",
    "javascript": "javascript.info",
    "typescript": "typescriptlang.org",
    "react": "react.dev",
    "next": "nextjs.org",
    "gsap": "greensock.com",
    "matter": "lenis.darkroom.engineering",
    "docker": "docker.com",
    "opnsense": "opnsense.org",
    "wazuh": "wazuh.com",
    "burp": "portswigger.net",
    "owasp": "zaproxy.org",
    "zap": "zaproxy.org",
    "nmap": "nmap.org",
    "gcp": "cloud.google.com",
    "esp32": "espressif.com",
    "git": "git-scm.com",
    "rest api": "restfulapi.net",
    "proxmox": "proxmox.com",
    "fuse": "fusejs.io"
  };
  
  for (const [key, domain] of Object.entries(map)) {
    if (name.includes(key)) return domain;
  }
  return null;
};

const loadCache = (): Record<string, string> => {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
    }
  } catch (e) {
    console.error("Cache read error:", e);
  }
  return {};
};

const saveCache = (cache: Record<string, string>) => {
  try {
    const dir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
  } catch (e) {
    console.error("Cache write error:", e);
  }
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tech: string }> }
) {
  const { tech } = await params;
  const techName = decodeURIComponent(tech).trim();
  
  if (!techName) {
    return new NextResponse("Missing tech parameter", { status: 400 });
  }

  // 1. Check predefined mapping
  let domain = getPredefinedDomain(techName);

  if (!domain) {
    // 2. Check file cache
    const cache = loadCache();
    const normalized = techName.toLowerCase();
    
    if (cache[normalized]) {
      domain = cache[normalized];
    } else {
      // 3. Fallback: resolve dynamically using Unavatar
      try {
        const response = await fetch(`https://unavatar.io/duckduckgo/${encodeURIComponent(normalized)}`, {
          method: "HEAD",
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        if (response.ok) {
          const urlObj = new URL(response.url);
          domain = urlObj.hostname;
          
          cache[normalized] = domain;
          saveCache(cache);
        }
      } catch (err) {
        console.error("Dynamic resolution error for " + techName + ":", err);
      }
      
      // If still no domain, fallback to guess
      if (!domain) {
        domain = normalized.replace(/[^a-z0-9]/g, "") + ".com";
      }
    }
  }

  // Return the Google Favicon redirect to serve the actual image directly
  const iconUrl = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=32`;
  
  return NextResponse.redirect(iconUrl, 307);
}
