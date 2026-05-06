import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInput, songName, movieName, aliases } = body;

    if (!userInput || !songName) {
      return NextResponse.json(
        { correct: false, confidence: 0, reason: 'Missing input' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // No API key — fall back to a simple check
      const input = userInput.toLowerCase().trim();
      const targets = [songName, movieName, ...aliases].filter(Boolean).map((s: string) => s.toLowerCase());
      const match = targets.some((t: string) =>
        t.includes(input) || input.includes(t) ||
        levenshtein(input, t) <= 3
      );
      return NextResponse.json({
        correct: match,
        confidence: match ? 0.7 : 0.1,
        reason: match ? 'Substring/edit distance match' : 'No match',
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are validating a Hindi film song guessing game answer.
The correct song is: "${songName}" from movie: "${movieName}".
Aliases: ${JSON.stringify(aliases)}.
The user answered: "${userInput}".
Return ONLY valid JSON: { "correct": boolean, "confidence": 0.0-1.0, "reason": string }
Be very generous — accept partial names, spelling errors, movie name instead of song name, or common nicknames.
CRITICAL RULE: If the user typed just a single word or part of the song name (e.g., answering "channa" for the song "Channa Mereya"), you MUST mark it as correct! A single matching word from the title is completely enough.`,
          },
          { role: 'user', content: userInput },
        ],
        temperature: 0.1,
        max_tokens: 100,
      }),
    });

    if (!response.ok) throw new Error('OpenAI API error');

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(content);

    return NextResponse.json({
      correct: parsed.correct ?? false,
      confidence: parsed.confidence ?? 0,
      reason: parsed.reason ?? 'AI validation',
    });
  } catch {
    return NextResponse.json(
      { correct: false, confidence: 0, reason: 'Validation error' },
      { status: 500 }
    );
  }
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}
