import { useState } from 'react'

export function MeetTeam() {
  const [hasPhoto, setHasPhoto] = useState(false)

  return (
    <section className="sec" id="team">
      <img
        src="/mockup/media/web/team.webp"
        alt=""
        width={1}
        height={1}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        onLoad={(e) => setHasPhoto(e.currentTarget.naturalWidth > 1)}
        onError={() => setHasPhoto(false)}
      />
      <div className={`wrap xmeet${hasPhoto ? '' : ' nophoto'}`} id="meet">
        {hasPhoto ? (
          <figure className="xmeet__photo">
            <img src="/mockup/media/web/team.webp" alt="ทีมงาน Chapter99" width={640} height={800} loading="lazy" />
          </figure>
        ) : null}
        <div className="rv">
          <span className="kicker">Meet Chapter99</span>
          <h2 className="th2" style={{ marginTop: 12 }}>
            คนไทยดูแลคนไทย
            <br />
            ในออสเตรเลีย
          </h2>
          <p className="xsub" style={{ maxWidth: '46ch' }}>
            ทีมเล็กในซิดนีย์ ทำงานกับธุรกิจไทยมาเกือบ 10 ปี คุยภาษาไทย และดูแลหลังเปิดใช้ตามแพ็กเกจ
          </p>
          <div className="xfacts">
            <div>
              <small>ที่ตั้ง</small>
              <b>Sydney, NSW</b>
            </div>
            <div>
              <small>ภาษา</small>
              <b>ไทย · English</b>
            </div>
            <div>
              <small>โทร</small>
              <b>0452 044 382</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
