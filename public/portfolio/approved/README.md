# Approved photography portfolio

# Approved photography portfolio

`/photography` is a **sales page only** when `manifest.json` has at least one REAL PHOTO with `permission.approved: true`. Until then the route is a layout + required-shot list. Never fake work.

Only files listed here with `permission.approved: true` appear as real photos.

Do not copy images from other folders automatically.

## manifest.json

```json
{
  "portfolio": [
    {
      "id": "food-01",
      "src": "/portfolio/approved/food-01.webp",
      "alt": "Thai dish photographed on location",
      "category": "food",
      "badge": "REAL PHOTO",
      "orientation": "landscape",
      "width": 1600,
      "height": 1067,
      "permission": { "approved": true, "note": "Shop written OK 2026-10-10" }
    }
  ],
  "beforeAfter": [
    {
      "id": "ba-food-01",
      "category": "food",
      "before": { "src": "/portfolio/approved/ba-food-01-before.webp", "alt": "Unstyled plate", "width": 1200, "height": 800 },
      "after": { "src": "/portfolio/approved/ba-food-01-after.webp", "alt": "Styled plate from same shoot", "width": 1200, "height": 800 },
      "sourceNote": "Same session, same dish. Shop written OK."
    }
  ]
}
```

### Fields

- `badge`: `REAL PHOTO` | `PHOTO + AI CREATIVE` | `DESIGN CONCEPT`
- `category` (portfolio): `food` | `restaurant` | `massage` | `products` | `reels`
- `category` (beforeAfter): `food` | `massage` | `products` | `restaurant`
- Images: WebP, put files in this folder, paths must start with `/portfolio/approved/`
- Never mark `approved: true` without written shop permission
- Never present AI images as REAL PHOTO
