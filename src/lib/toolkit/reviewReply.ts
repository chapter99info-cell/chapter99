export type RvTone = 'friendly' | 'professional' | 'warm'
export type RvLang = 'en' | 'th' | 'both'
export type RvBucket = 'pos' | 'mid' | 'neg'

const RV: Record<RvBucket, Record<'en' | 'th', Record<RvTone, [string, string]>>> = {
  pos: {
    en: {
      friendly: [
        'Thank you so much for your kind words! We’re so happy you enjoyed your visit and we’d love to welcome you back soon.',
        'What a lovely review — thank you! It means a lot to our team, and we hope to see you again soon.',
      ],
      professional: [
        'Thank you for taking the time to share your feedback. We are pleased that you had a positive experience and look forward to welcoming you again.',
        'We sincerely appreciate your review and are delighted to hear you were satisfied with our service.',
      ],
      warm: [
        'Your review made our day — thank you from all of us! It was a joy to look after you, and you’re always welcome back.',
        'Thank you from the bottom of our hearts for such kind words. We can’t wait to see you again!',
      ],
    },
    th: {
      friendly: [
        'ขอบคุณมากสำหรับคำชมค่ะ/ครับ ดีใจมากที่ประทับใจ หวังว่าจะได้ต้อนรับอีกเร็ว ๆ นี้',
        'ขอบคุณสำหรับรีวิวดี ๆ ทีมงานดีใจมาก แล้วพบกันใหม่นะครับ/คะ',
      ],
      professional: [
        'ขอบคุณที่สละเวลาแบ่งปันความคิดเห็น เรายินดีที่คุณได้รับประสบการณ์ที่ดี และหวังว่าจะได้ให้บริการอีกครั้ง',
        'ขอบคุณสำหรับรีวิว เรายินดีที่คุณพึงพอใจกับบริการของเรา',
      ],
      warm: [
        'รีวิวของคุณทำให้เรายิ้มทั้งวัน ขอบคุณจากใจทุกคนในทีม ยินดีต้อนรับเสมอ',
        'ขอบคุณจากใจสำหรับคำพูดดี ๆ รอต้อนรับอีกครั้งนะครับ/คะ',
      ],
    },
  },
  mid: {
    en: {
      friendly: [
        'Thank you for your feedback — we’re glad you visited and appreciate you telling us where we can do better. We’d love another chance to impress you!',
        'Thanks for sharing your honest thoughts. We’re always improving, and we hope to see you again.',
      ],
      professional: [
        'Thank you for your feedback. We value your comments and will use them to improve our service. We hope to welcome you again.',
        'We appreciate you taking the time to review us. Your comments have been noted and we look forward to serving you better.',
      ],
      warm: [
        'Thank you for such honest feedback — it really helps us grow. We’d be so happy to welcome you back and make the next visit even better.',
        'We appreciate you sharing your experience. Thank you, and we hope to see you again soon.',
      ],
    },
    th: {
      friendly: [
        'ขอบคุณสำหรับความคิดเห็นค่ะ/ครับ ดีใจที่มาใช้บริการ และขอบคุณที่บอกว่าเราปรับปรุงตรงไหนได้ หวังว่าจะได้โอกาสอีกครั้ง',
        'ขอบคุณที่แบ่งปันความเห็นตรง ๆ เราพัฒนาอยู่เสมอ และหวังว่าจะได้พบกันอีก',
      ],
      professional: [
        'ขอบคุณสำหรับความคิดเห็น เราให้ความสำคัญและจะนำไปปรับปรุงบริการ หวังว่าจะได้ต้อนรับอีกครั้ง',
        'ขอบคุณที่สละเวลารีวิว เราบันทึกความเห็นของคุณแล้ว และจะพัฒนาให้ดียิ่งขึ้น',
      ],
      warm: [
        'ขอบคุณสำหรับความเห็นตรง ๆ ช่วยให้เราเติบโต ยินดีต้อนรับกลับมา และจะทำให้ดีกว่าเดิม',
        'ขอบคุณที่เล่าประสบการณ์ให้ฟัง หวังว่าจะได้พบกันอีก',
      ],
    },
  },
  neg: {
    en: {
      friendly: [
        'We’re really sorry your visit didn’t meet expectations. We’d like to hear more and put things right — please contact us at [your contact details].',
        'Thank you for letting us know, and we’re sorry we let you down. Please reach out at [your contact details] so we can look into it.',
      ],
      professional: [
        'We apologise that your experience did not meet your expectations. We take feedback seriously — please contact us at [your contact details] so we can look into this.',
        'Thank you for your feedback. We regret that we fell short, and would welcome the chance to discuss this further at [your contact details].',
      ],
      warm: [
        'We’re truly sorry to read this — it isn’t the experience we want for anyone. Please get in touch at [your contact details]; we’d really like to make it right.',
        'Thank you for telling us, and we’re sorry. Your feedback matters to us — please contact us at [your contact details] so we can talk it through.',
      ],
    },
    th: {
      friendly: [
        'ต้องขออภัยที่ประสบการณ์ไม่เป็นไปตามที่คาดหวัง อยากรับฟังเพิ่มเติมและแก้ไขให้ กรุณาติดต่อเราที่ [ช่องทางติดต่อของคุณ]',
        'ขอบคุณที่แจ้งให้ทราบและขออภัยที่ทำให้ผิดหวัง กรุณาติดต่อที่ [ช่องทางติดต่อของคุณ] เพื่อให้เราตรวจสอบ',
      ],
      professional: [
        'เราขออภัยที่ประสบการณ์ไม่เป็นไปตามความคาดหวัง เราให้ความสำคัญกับคำติชม กรุณาติดต่อ [ช่องทางติดต่อของคุณ] เพื่อให้เราตรวจสอบ',
        'ขอบคุณสำหรับความคิดเห็น เราเสียใจที่ยังทำได้ไม่ดีพอ และยินดีพูดคุยเพิ่มเติมที่ [ช่องทางติดต่อของคุณ]',
      ],
      warm: [
        'เสียใจจริง ๆ ที่ได้อ่านเช่นนี้ ไม่ใช่ประสบการณ์ที่เราต้องการมอบให้ใคร กรุณาติดต่อ [ช่องทางติดต่อของคุณ] เราอยากแก้ไขให้ดีขึ้น',
        'ขอบคุณที่บอกเรา และขออภัย ความเห็นของคุณสำคัญ กรุณาติดต่อ [ช่องทางติดต่อของคุณ] เพื่อพูดคุยกัน',
      ],
    },
  },
}

const SHORT: Record<RvBucket, { en: string; th: string }> = {
  pos: { en: 'Thank you so much for your review — we hope to see you again soon!', th: 'ขอบคุณมากสำหรับรีวิว หวังว่าจะได้พบกันอีก' },
  mid: { en: 'Thank you for your feedback — we’ll keep improving.', th: 'ขอบคุณสำหรับความเห็น เราจะพัฒนาต่อไป' },
  neg: { en: 'We’re sorry — please contact us at [your contact details] so we can help.', th: 'ขออภัยด้วย กรุณาติดต่อ [ช่องทางติดต่อของคุณ] เพื่อให้เราช่วยแก้ไข' },
}

export function ratingBucket(rate: number): RvBucket {
  if (rate >= 4) return 'pos'
  if (rate === 3) return 'mid'
  return 'neg'
}

export function draftReviewReply(input: {
  rate: number
  tone: RvTone
  lang: RvLang
  biz: string
  variant: number
  shorter: boolean
}) {
  const bucket = ratingBucket(input.rate)
  const sign = input.biz ? `\n— ${input.biz}` : ''
  const pick = (l: 'en' | 'th') =>
    (input.shorter ? SHORT[bucket][l] : RV[bucket][l][input.tone][input.variant % 2]) + sign
  return {
    bucket,
    english: input.lang === 'th' ? '' : pick('en'),
    thai: input.lang === 'en' ? '' : pick('th'),
  }
}
