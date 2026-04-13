# 🎮 Valorant Stats Card

Dynamic SVG card showing your Valorant stats — rank, K/D, win rate, headshot %, top agent, and more. Designed for GitHub profile READMEs.

![preview](https://img.shields.io/badge/Preview-Click_to_see-FF4655?style=for-the-badge)

## How It Works

A Vercel serverless function fetches your stats from the [HenrikDev Valorant API](https://docs.henrikdev.xyz), generates a styled SVG card, and serves it as an image. GitHub renders it in your README. Stats refresh every 30 minutes.

## Setup (5 minutes)

### Step 1: Get a HenrikDev API Key

1. Go to [https://api.henrikdev.xyz/dashboard/](https://api.henrikdev.xyz/dashboard/)
2. Join their Discord (required for key generation)
3. Generate a **Basic** API key (instant, free)

### Step 2: Deploy to Vercel

1. Push this repo to your GitHub account
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Add an environment variable:
   - **Name:** `HENRIK_API_KEY`
   - **Value:** Your API key from Step 1
5. Click **Deploy**

### Step 3: Add to Your GitHub README

After deployment, your card URL will be:

```
https://your-vercel-project.vercel.app/api/card?name=noobshooter&tag=2169&region=ap
```

Add this to your GitHub profile README:

```markdown
![Valorant Stats](https://your-vercel-project.vercel.app/api/card?name=noobshooter&tag=2169&region=ap)
```

### Query Parameters

| Param | Required | Description | Example |
|-------|----------|-------------|---------|
| `name` | Yes | Your Riot display name | `noobshooter` |
| `tag` | Yes | Your tagline | `2169` |
| `region` | No | Server region (default: `ap`) | `ap`, `eu`, `na`, `kr` |

## Stats Shown

- **Rank & RR** — Current competitive rank with ranking rating
- **K/D** — Kill/Death ratio (last 20 competitive matches)
- **Win %** — Win rate from recent matches
- **HS %** — Headshot percentage
- **Top Agent** — Most played agent
- **Kills / Deaths / Assists** — Totals from recent matches
- **Matches** — Number of recent matches analyzed

## Tech Stack

- **Runtime:** Vercel Serverless Functions (Node.js)
- **API:** HenrikDev Unofficial Valorant API
- **Output:** Dynamic SVG with rank-based color theming

## Color Themes

The card automatically changes accent colors based on your rank:
- 🟤 Iron/Bronze — warm tones
- ⚪ Silver — cool grey
- 🟡 Gold — golden accent
- 🔵 Platinum/Diamond — cyan/ice blue
- 🟢 Ascendant — green
- 🔴 Immortal — Valorant red
- ✨ Radiant — luminous gold

## License

MIT — Built by [Hritesh Goldar](https://github.com/hritesh94)
