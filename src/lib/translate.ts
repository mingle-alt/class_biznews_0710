const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const TRANSLATE_TIMEOUT_MS = 20_000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2_000;

interface Translated {
  title: string;
  summary: string | null;
}

function extractJson(text: string): { title?: string; summary?: string } | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestTranslation(
  title: string,
  summary: string | null,
  apiKey: string,
): Promise<{ title?: string; summary?: string } | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: [
              "Translate the following English news title and summary into natural, concise Korean suitable for a news dashboard.",
              'Respond with ONLY a JSON object like {"title": "...", "summary": "..."} and no other text.',
              `Title: ${title}`,
              summary ? `Summary: ${summary}` : "Summary: (none)",
            ].join("\n"),
          },
        ],
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    return extractJson(content);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function translateToKorean(title: string, summary: string | null): Promise<Translated> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return { title, summary };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const parsed = await requestTranslation(title, summary, apiKey);
    if (parsed?.title) {
      return {
        title: parsed.title,
        summary: summary ? (parsed.summary ?? summary) : null,
      };
    }
    if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
  }

  return { title, summary };
}
