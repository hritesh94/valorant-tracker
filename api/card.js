const RANK_COLORS = {
  "Unranked": { bg: "#2C2F33", accent: "#72767D" },
  "Iron": { bg: "#2C2F33", accent: "#8B8D8F" },
  "Bronze": { bg: "#2C2220", accent: "#CD7F32" },
  "Silver": { bg: "#2C2F33", accent: "#C0C0C0" },
  "Gold": { bg: "#2C2A1E", accent: "#FFD700" },
  "Platinum": { bg: "#1E2C2C", accent: "#00CED1" },
  "Diamond": { bg: "#1E1E2C", accent: "#B9F2FF" },
  "Ascendant": { bg: "#1E2C1E", accent: "#2ECC71" },
  "Immortal": { bg: "#2C1E1E", accent: "#FF4655" },
  "Radiant": { bg: "#2C2A1E", accent: "#FFFACD" },
};

function getRankBase(tierName) {
  if (!tierName) return "Unranked";
  for (const rank of Object.keys(RANK_COLORS)) {
    if (tierName.toLowerCase().includes(rank.toLowerCase())) return rank;
  }
  return "Unranked";
}

function generateSVG(data) {
  const {
    name = "Unknown",
    tag = "0000",
    level = 0,
    rank = "Unranked",
    rr = 0,
    kd = "N/A",
    winRate = "N/A",
    headshot = "N/A",
    kills = 0,
    deaths = 0,
    assists = 0,
    topAgent = "N/A",
    matches = 0,
  } = data;

  const rankBase = getRankBase(rank);
  const colors = RANK_COLORS[rankBase] || RANK_COLORS["Unranked"];
  const accent = colors.accent;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="320" viewBox="0 0 500 320" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="500" y2="320" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0D1117"/>
      <stop offset="100%" stop-color="#161B22"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="500" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${accent}88"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <clipPath id="rounded">
      <rect width="500" height="320" rx="15"/>
    </clipPath>
  </defs>

  <g clip-path="url(#rounded)">
    <!-- Background -->
    <rect width="500" height="320" fill="url(#bg)"/>

    <!-- Top accent line -->
    <rect width="500" height="3" fill="url(#accent)"/>

    <!-- Subtle grid pattern -->
    <g opacity="0.03">
      ${Array.from({length: 20}, (_, i) => `<line x1="0" y1="${i * 16}" x2="500" y2="${i * 16}" stroke="white" stroke-width="0.5"/>`).join("")}
      ${Array.from({length: 32}, (_, i) => `<line x1="${i * 16}" y1="0" x2="${i * 16}" y2="320" stroke="white" stroke-width="0.5"/>`).join("")}
    </g>

    <!-- Valorant logo watermark -->
    <g transform="translate(380, 20)" opacity="0.06">
      <path d="M0 0 L50 70 L60 70 L60 0 L45 0 L45 45 L15 0 Z" fill="white"/>
    </g>

    <!-- Header section -->
    <g transform="translate(25, 25)">
      <!-- Player icon circle -->
      <circle cx="22" cy="22" r="22" fill="${accent}22" stroke="${accent}" stroke-width="1.5"/>
      <text x="22" y="28" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="bold" fill="${accent}">
        ${name.charAt(0).toUpperCase()}
      </text>

      <!-- Player name & tag -->
      <text x="55" y="20" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">
        ${escapeXml(name)}
      </text>
      <text x="55" y="40" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#8B949E">
        #${escapeXml(tag)} · Level ${level}
      </text>
    </g>

    <!-- Rank badge -->
    <g transform="translate(350, 25)">
      <rect width="125" height="44" rx="10" fill="${accent}15" stroke="${accent}44" stroke-width="1"/>
      <text x="62" y="20" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" font-weight="bold" fill="${accent}" filter="url(#glow)">
        ${escapeXml(rank)}
      </text>
      <text x="62" y="36" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="#8B949E">
        ${rr} RR
      </text>
    </g>

    <!-- Divider -->
    <line x1="25" y1="80" x2="475" y2="80" stroke="#21262D" stroke-width="1"/>

    <!-- Stats Grid -->
    <!-- Row 1 -->
    <g transform="translate(25, 95)">
      ${statBox(0, 0, "K/D", kd, accent)}
      ${statBox(112, 0, "Win %", winRate, accent)}
      ${statBox(224, 0, "HS %", headshot, accent)}
      ${statBox(336, 0, "Matches", matches.toString(), accent)}
    </g>

    <!-- Row 2 -->
    <g transform="translate(25, 175)">
      ${statBox(0, 0, "Kills", kills.toString(), accent)}
      ${statBox(112, 0, "Deaths", deaths.toString(), accent)}
      ${statBox(224, 0, "Assists", assists.toString(), accent)}
      ${statBox(336, 0, "Top Agent", topAgent, accent)}
    </g>

    <!-- Footer -->
    <g transform="translate(25, 270)">
      <line x1="0" y1="0" x2="450" y2="0" stroke="#21262D" stroke-width="1"/>
      <text x="0" y="30" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="#484F58">
        ⚡ valorant-stats-card · Updated every 30 min
      </text>
      <text x="450" y="30" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="#484F58">
        powered by HenrikDev API
      </text>
    </g>
  </g>

  <!-- Border -->
  <rect width="500" height="320" rx="15" fill="none" stroke="#21262D" stroke-width="1"/>
</svg>`;
}

function statBox(x, y, label, value, accent) {
  return `
    <g transform="translate(${x}, ${y})">
      <rect width="100" height="65" rx="8" fill="#161B2244" stroke="#21262D" stroke-width="1"/>
      <text x="50" y="25" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="#8B949E">
        ${escapeXml(label)}
      </text>
      <text x="50" y="48" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="bold" fill="${accent}">
        ${escapeXml(value)}
      </text>
    </g>`;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateErrorSVG(message) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="120" viewBox="0 0 500 120">
  <rect width="500" height="120" rx="15" fill="#0D1117" stroke="#FF4655" stroke-width="1"/>
  <text x="250" y="45" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="bold" fill="#FF4655">
    ⚠ Valorant Stats Card
  </text>
  <text x="250" y="75" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#8B949E">
    ${escapeXml(message)}
  </text>
</svg>`;
}

module.exports = async function handler(req, res) {
  const { name, tag, region } = req.query;

  if (!name || !tag) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(400).send(generateErrorSVG("Missing ?name=XXX&tag=XXX params"));
  }

  const apiKey = process.env.HENRIK_API_KEY;
  const headers = apiKey ? { Authorization: apiKey } : {};
  const playerRegion = region || "ap";

  try {
    // Fetch account data
    const accountRes = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      { headers }
    );
    const accountData = await accountRes.json();

    if (accountData.status !== 200 && accountData.status !== 1) {
      res.setHeader("Content-Type", "image/svg+xml");
      return res.send(generateErrorSVG(`Account not found: ${name}#${tag}`));
    }

    const account = accountData.data;
    const level = account.account_level || 0;

    // Fetch MMR/rank data
    let rank = "Unranked";
    let rr = 0;
    try {
      const mmrRes = await fetch(
        `https://api.henrikdev.xyz/valorant/v2/mmr/${playerRegion}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
        { headers }
      );
      const mmrData = await mmrRes.json();
      if (mmrData.data && mmrData.data.current_data) {
        rank = mmrData.data.current_data.currenttierpatched || "Unranked";
        rr = mmrData.data.current_data.ranking_in_tier || 0;
      }
    } catch (e) {
      // MMR fetch failed, use defaults
    }

    // Fetch match history for stats
    let kills = 0, deaths = 0, assists = 0, wins = 0, matches = 0;
    let headshots = 0, bodyshots = 0, legshots = 0;
    const agentCount = {};

    try {
      const matchRes = await fetch(
        `https://api.henrikdev.xyz/valorant/v1/stored-matches/${playerRegion}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?mode=competitive&size=20`,
        { headers }
      );
      const matchData = await matchRes.json();

      if (matchData.data && Array.isArray(matchData.data)) {
        matchData.data.forEach((match) => {
          const stats = match.stats;
          if (!stats) return;

          matches++;
          kills += stats.kills || 0;
          deaths += stats.deaths || 0;
          assists += stats.assists || 0;

          if (stats.shots) {
            headshots += stats.shots.head || 0;
            bodyshots += stats.shots.body || 0;
            legshots += stats.shots.leg || 0;
          }

          if (stats.character && stats.character.name) {
            const agent = stats.character.name;
            agentCount[agent] = (agentCount[agent] || 0) + 1;
          }

          // Determine win
          const team = stats.team;
          if (team && match.teams) {
            const teamScore = team.toLowerCase() === "red" ? match.teams.red : match.teams.blue;
            const enemyScore = team.toLowerCase() === "red" ? match.teams.blue : match.teams.red;
            if (teamScore > enemyScore) wins++;
          }
        });
      }
    } catch (e) {
      // Match fetch failed, use defaults
    }

    const kd = deaths > 0 ? (kills / deaths).toFixed(2) : kills > 0 ? kills.toFixed(2) : "N/A";
    const winRate = matches > 0 ? Math.round((wins / matches) * 100) + "%" : "N/A";
    const totalShots = headshots + bodyshots + legshots;
    const hsPercent = totalShots > 0 ? Math.round((headshots / totalShots) * 100) + "%" : "N/A";
    const topAgent = Object.keys(agentCount).length > 0
      ? Object.entries(agentCount).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

    const svg = generateSVG({
      name: account.name || name,
      tag: account.tag || tag,
      level,
      rank,
      rr,
      kd,
      winRate,
      headshot: hsPercent,
      kills,
      deaths,
      assists,
      topAgent,
      matches,
    });

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    return res.send(svg);
  } catch (error) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(generateErrorSVG("Failed to fetch data. Try again later."));
  }
};
