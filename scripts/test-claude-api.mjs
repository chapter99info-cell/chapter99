/**
 * Probe Anthropic /v1/messages with old vs new model IDs.
 * Run: node scripts/test-claude-api.mjs
 */
const apiKey =
  process.env.VITE_ANTHROPIC_API_KEY?.trim() ||
  (await (async () => {
    const js = await fetch(
      'https://www.chapter99info.com/assets/AdminApp-ME7KSB_W.js'
    ).then((r) => r.text())
    const m = js.match(/sk-ant-api03-[A-Za-z0-9_-]+/)
    return m?.[0] ?? ''
  })())

if (!apiKey) {
  console.error('No Anthropic API key available')
  process.exit(1)
}

async function probe(model) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 32,
      messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
    }),
  })

  const body = await response.text()
  return { model, status: response.status, body }
}

for (const model of ['claude-sonnet-4-20250514', 'claude-sonnet-4-6']) {
  const result = await probe(model)
  console.log(`\n=== ${result.model} (${result.status}) ===`)
  console.log(result.body)
}
