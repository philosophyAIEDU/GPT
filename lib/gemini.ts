import type { SourceItem } from "@/data/sources";

export type GeminiAnswer = {
  summary: string;
  key_points: string[];
  checklist: string[];
  cautions: string[];
  recommended_sources: Array<{ title: string; url: string; why: string }>;
};

const MODEL_NAME = "gemini-3-flash-preview";

const extractJson = (text: string) => {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? text;
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("JSON 형식의 응답을 파싱할 수 없습니다.");
  }

  return JSON.parse(raw.slice(firstBrace, lastBrace + 1)) as GeminiAnswer;
};

export const generateAdmissionsAnswer = async ({
  apiKey,
  question,
  sources,
}: {
  apiKey: string;
  question: string;
  sources: SourceItem[];
}) => {
  const prompt = [
    "너는 한국 고등학생을 돕는 입시 코치야. 친절하고 명확하게 답해.",
    "반드시 출처 기반으로 설명하고, 확실하지 않으면 '모르겠다'고 말한 뒤 공식 출처 확인을 유도해.",
    "아래 JSON 스키마를 반드시 지켜서 출력해.",
    "{\"summary\":\"string\",\"key_points\":[\"string\"],\"checklist\":[\"string\"],\"cautions\":[\"string\"],\"recommended_sources\":[{\"title\":\"string\",\"url\":\"string\",\"why\":\"string\"}]}",
    "recommended_sources는 최소 3개 이상 포함해.",
    "날짜/전형요강 관련 질문이면 cautions에 '해당 연도 전형요강을 반드시 확인하세요.'를 넣어.",
    "질문:",
    question,
    "참고 가능한 출처 목록:",
    ...sources.map(
      (source) =>
        `- ${source.title} | ${source.organization} | ${source.description} | ${source.url}`,
    ),
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Gemini 호출에 실패했습니다. API Key와 네트워크 상태를 확인하세요.");
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini 응답이 비어 있습니다.");
  }

  const parsed = extractJson(text);
  return parsed;
};

export const testGeminiApiKey = async (apiKey: string) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "reply with OK" }] }],
      }),
    },
  );

  if (!response.ok) {
    throw new Error("유효하지 않은 API Key이거나 사용 권한이 없습니다.");
  }

  return true;
};
