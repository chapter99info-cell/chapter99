"""One-off: prepare PWA icon set in public/icons/ from master 512px PNG."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "icons"
SOURCE = Path(r"C:\Users\Saen Man\Downloads\icon-512.png")
MASKABLE_BG = "#1A1A1A"
SAFE_RATIO = 0.72


def main() -> None:
    if not SOURCE.is_file():
        raise SystemExit(f"Source icon not found: {SOURCE}")

    OUT.mkdir(parents=True, exist_ok=True)
    master = Image.open(SOURCE).convert("RGBA")

    if master.size != (512, 512):
        master = master.resize((512, 512), Image.Resampling.LANCZOS)

    master.convert("RGB").save(OUT / "icon-512.png")

    safe = int(512 * SAFE_RATIO)
    logo = master.copy()
    logo.thumbnail((safe, safe), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (512, 512), MASKABLE_BG)
    canvas.paste(logo, ((512 - logo.width) // 2, (512 - logo.height) // 2), logo)
    canvas.convert("RGB").save(OUT / "icon-512-maskable.png")

    for size, name in ((192, "icon-192.png"), (180, "icon-180.png"), (32, "favicon-32.png")):
        resized = master.resize((size, size), Image.Resampling.LANCZOS)
        resized.convert("RGB").save(OUT / name)

    print(f"Wrote icons to {OUT}")


if __name__ == "__main__":
    main()
