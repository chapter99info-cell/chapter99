export const LOGO_URL =
  'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/Photos/Logo/Chapter99_st.png'

type LogoMarkProps = {
  className?: string
  invert?: boolean
  size?: 'sm' | 'md'
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
}

export function LogoMark({ className = '', invert = false, size = 'md' }: LogoMarkProps) {
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-full transition-transform duration-200 ease-out hover:scale-105 active:scale-105 ${sizeClasses[size]} ${className}`}
    >
      <img
        src={LOGO_URL}
        alt="Chapter99"
        className={`h-full w-full object-cover ${invert ? 'brightness-0 invert' : ''}`}
        draggable={false}
      />
    </span>
  )
}
