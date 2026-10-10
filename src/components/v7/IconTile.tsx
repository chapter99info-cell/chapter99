import '../../styles/v7-icons.css'

type Props = {
  src: string
  /** Visible Thai label only — Icons8 IDs live in src/data/v7Icons.ts */
  label: string
  alt?: string
}

export function IconTile({ src, label, alt }: Props) {
  return (
    <figure className="v7-icon-tile">
      <img src={src} alt={alt ?? ''} width={56} height={56} />
      <figcaption>{label}</figcaption>
    </figure>
  )
}
