import { useState } from 'react'
import { IconTile } from '../components/v7/IconTile'
import { v7Icons, type V7IconStyle } from '../data/v7Icons'
import '../styles/v7-icons.css'

export function V7IconsTestPage() {
  const [style, setStyle] = useState<V7IconStyle>('both')

  return (
    <main className="v7-icons-test">
      <h1>V7 icons test</h1>
      <p>Icons8 iOS · ทองบน navy · ไอคอน 56px ข้อความ 18px+ · รหัสไอคอนเก็บใน metadata เท่านั้น</p>
      <div className="v7-icons-toggle" role="group" aria-label="สไตล์ไอคอน">
        <button type="button" aria-pressed={style === 'line'} onClick={() => setStyle('line')}>
          Line
        </button>
        <button type="button" aria-pressed={style === 'filled'} onClick={() => setStyle('filled')}>
          Filled
        </button>
        <button type="button" aria-pressed={style === 'both'} onClick={() => setStyle('both')}>
          ทั้งคู่
        </button>
      </div>
      {style === 'both' ? (
        <div className="v7-icons-compare">
          <section>
            <h2>Line</h2>
            <div className="v7-icons-grid">
              {v7Icons.map((icon) => (
                <IconTile
                  key={`line-${icon.file}`}
                  src={`/icons/v7/${icon.file}`}
                  label={icon.label}
                  alt={icon.label}
                />
              ))}
            </div>
          </section>
          <section>
            <h2>Filled</h2>
            <div className="v7-icons-grid">
              {v7Icons.map((icon) => (
                <IconTile
                  key={`filled-${icon.file}`}
                  src={`/icons/v7/filled/${icon.file}`}
                  label={icon.label}
                  alt={icon.label}
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="v7-icons-grid">
          {v7Icons.map((icon) => (
            <IconTile
              key={`${style}-${icon.file}`}
              src={style === 'filled' ? `/icons/v7/filled/${icon.file}` : `/icons/v7/${icon.file}`}
              label={icon.label}
              alt={icon.label}
            />
          ))}
        </div>
      )}
      <p>
        <a href="https://icons8.com" rel="noopener noreferrer">
          Icons by Icons8
        </a>
        {' · '}
        <a href="/v7">กลับ /v7</a>
      </p>
    </main>
  )
}
