# dataFansub

An index dedicated to recommending releases by Spanish-language fansubs, primarily publishing on Nyaa and NekoBT. The site keeps current season anime updated while gradually adding titles from previous seasons. This site only displays release information—we don't host any torrents.

## Features

- Real-time data from PocketBase API
- Anime listings with season/fansub grouping
- Spanish variant support (Latin America / Spain)
- Dark mode support
- Responsive design for mobile and desktop
- Pagination and search functionality

## Tech Stack

- **Framework**: [Astro](https://astro.build) (SSR mode)
- **Runtime**: Node.js adapter
- **Styling**: Vanilla CSS with CSS custom properties
- **Data Source**: PocketBase API
- **External API**: AniList (for anime metadata)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open http://localhost:4321 to view the site.

### Build

```bash
pnpm build
```

The output will be in the `dist/` directory.

## Environment Variables

Create a `.env` file in the root directory:

```env
PUBLIC_API_URL=https://datafansub.bye.moe
```

## Project Structure

```
src/
├── components/           # Astro components
│   ├── common/           # Shared components
│   │   ├── navbar.astro
│   │   └── pagination.astro
│   ├── entryTable.astro
│   └── scripts.astro
├── lib/                  # TypeScript utilities
│   ├── types.ts          # Type definitions
│   ├── utils.ts          # Helper functions
│   ├── anilist.ts        # AniList API integration
│   └── datafansub.ts     # Main data fetching
├── pages/                # Astro pages
│   ├── index.astro
│   ├── about.astro
│   ├── health.astro
│   └── boochi.ts
└── styles/               # CSS files (modular)
    ├── variables.css
    ├── base.css
    ├── global.css
    ├── navbar.css
    ├── table.css
    ├── mobile.css
    ├── pagination.css
    └── about.css
```

## License

MIT
