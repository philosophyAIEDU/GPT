"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  admissionsSources,
  categoryList,
  type AdmissionsCategory,
  type SourceItem,
} from "@/data/sources";
import {
  generateAdmissionsAnswer,
  testGeminiApiKey,
  type GeminiAnswer,
} from "@/lib/gemini";

type BookmarkItem = {
  id: string;
  question: string;
  answer: GeminiAnswer;
  memo: string;
  createdAt: string;
};

const API_KEY_STORAGE = "GEMINI_API_KEY";
const BOOKMARKS_STORAGE = "BOOKMARKS";
const SESSION_KEY_STORAGE = "GEMINI_API_KEY_SESSION";

export default function Home() {
  const [selectedCategory, setSelectedCategory] =
    useState<AdmissionsCategory>("전형 개요");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [activeApiKey, setActiveApiKey] = useState("");
  const [sessionOnly, setSessionOnly] = useState(false);
  const [keyStatus, setKeyStatus] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<GeminiAnswer | null>(null);
  const [answerError, setAnswerError] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [memoDraft, setMemoDraft] = useState("");

  useEffect(() => {
    const savedLocalKey = window.localStorage.getItem(API_KEY_STORAGE);
    const savedSessionKey = window.sessionStorage.getItem(SESSION_KEY_STORAGE);
    const localBookmarks = window.localStorage.getItem(BOOKMARKS_STORAGE);

    if (savedSessionKey) {
      setSessionOnly(true);
      setActiveApiKey(savedSessionKey);
    } else if (savedLocalKey) {
      setSessionOnly(false);
      setActiveApiKey(savedLocalKey);
    }

    if (localBookmarks) {
      setBookmarks(JSON.parse(localBookmarks) as BookmarkItem[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(BOOKMARKS_STORAGE, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const selectedSources = useMemo<SourceItem[]>(
    () => admissionsSources[selectedCategory],
    [selectedCategory],
  );

  const saveApiKey = () => {
    if (!apiKeyInput.trim()) {
      setKeyStatus("API Key를 입력해주세요.");
      return;
    }

    if (sessionOnly) {
      window.sessionStorage.setItem(SESSION_KEY_STORAGE, apiKeyInput.trim());
      window.localStorage.removeItem(API_KEY_STORAGE);
    } else {
      window.localStorage.setItem(API_KEY_STORAGE, apiKeyInput.trim());
      window.sessionStorage.removeItem(SESSION_KEY_STORAGE);
    }

    setActiveApiKey(apiKeyInput.trim());
    setApiKeyInput("");
    setKeyStatus("API Key가 저장되었습니다.");
  };

  const deleteApiKey = () => {
    window.localStorage.removeItem(API_KEY_STORAGE);
    window.sessionStorage.removeItem(SESSION_KEY_STORAGE);
    setActiveApiKey("");
    setApiKeyInput("");
    setKeyStatus("API Key가 삭제되었습니다.");
  };

  const onTestApiKey = async () => {
    const keyToTest = apiKeyInput.trim() || activeApiKey;
    if (!keyToTest) {
      setKeyStatus("테스트할 API Key를 먼저 입력해주세요.");
      return;
    }

    setKeyStatus("테스트 중...");
    try {
      await testGeminiApiKey(keyToTest);
      setKeyStatus("API Key 테스트 성공: Gemini 호출 가능");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "API Key 테스트에 실패했습니다.";
      setKeyStatus(message);
    }
  };

  const submitQuestion = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeApiKey) {
      setAnswerError("먼저 Gemini API Key를 설정해주세요.");
      return;
    }

    if (!question.trim()) {
      setAnswerError("질문을 입력해주세요.");
      return;
    }

    setLoading(true);
    setAnswerError("");

    try {
      const result = await generateAdmissionsAnswer({
        apiKey: activeApiKey,
        question,
        sources: selectedSources,
      });

      const dateKeywords = /(일정|날짜|원서접수|마감|전형요강|모집요강|언제)/;
      if (dateKeywords.test(question) && !result.cautions.includes("해당 연도 전형요강을 반드시 확인하세요.")) {
        result.cautions.push("해당 연도 전형요강을 반드시 확인하세요.");
      }

      setAnswer(result);
      setMemoDraft("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "답변 생성에 실패했습니다.";
      setAnswerError(message);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = () => {
    if (!answer || !question) {
      return;
    }

    setBookmarks((prev) => [
      {
        id: crypto.randomUUID(),
        question,
        answer,
        memo: memoDraft,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateBookmarkMemo = (id: string, memo: string) => {
    setBookmarks((prev) => prev.map((item) => (item.id === id ? { ...item, memo } : item)));
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-4 p-6 lg:grid-cols-[250px_1fr_380px]">
      <aside className="rounded-xl border bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">입시 정보 허브</h1>
        <p className="mt-2 text-sm text-slate-600">카테고리별 신뢰 출처를 먼저 확인해보세요.</p>

        <div className="mt-4 space-y-2">
          {categoryList.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </aside>

      <section className="space-y-4">
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          ⚠️ 공용 PC에서는 API Key 저장을 피하세요. 키는 서버 DB에 저장되지 않으며, 본인 기기에서만 사용하세요.
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">Gemini API Key</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(event) => setApiKeyInput(event.target.value)}
                placeholder="AIza..."
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sessionOnly}
                onChange={(event) => setSessionOnly(event.target.checked)}
              />
              session-only
            </label>
            <button type="button" onClick={saveApiKey} className="rounded-md bg-blue-600 px-4 py-2 text-white">
              저장
            </button>
            <button type="button" onClick={onTestApiKey} className="rounded-md bg-slate-700 px-4 py-2 text-white">
              키 테스트
            </button>
            <button type="button" onClick={deleteApiKey} className="rounded-md bg-rose-600 px-4 py-2 text-white">
              키 삭제/변경
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            현재 키 상태: {activeApiKey ? "설정됨(마스킹 처리)" : "미설정"}
          </p>
          {keyStatus && <p className="mt-1 text-sm text-blue-700">{keyStatus}</p>}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">{selectedCategory} - 신뢰 출처 링크 모음</h2>
          <ul className="mt-3 space-y-3">
            {selectedSources.map((source) => (
              <li key={`${source.title}-${source.url}`} className="rounded-md border p-3">
                <p className="font-semibold">{source.title}</p>
                <p className="text-sm text-slate-600">{source.organization}</p>
                <p className="mt-1 text-sm">{source.description}</p>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-blue-700 underline"
                >
                  {source.url}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submitQuestion} className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">질문하기 (요약/체크리스트/타임라인)</h2>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="예: 학생부종합전형 준비를 6개월 타임라인으로 정리해줘."
            className="mt-2 h-28 w-full rounded-md border p-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "생성 중..." : "Gemini로 답변 생성"}
          </button>
          {answerError && <p className="mt-2 text-sm text-rose-600">{answerError}</p>}
        </form>

        {answer && (
          <article className="space-y-3 rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold">답변 결과</h3>
            <p>
              <span className="font-semibold">한줄 요약:</span> {answer.summary}
            </p>
            <div>
              <p className="font-semibold">핵심 포인트</p>
              <ul className="list-disc pl-5">
                {answer.key_points.slice(0, 5).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold">체크리스트</p>
              <ul className="list-disc pl-5">
                {answer.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold">주의사항/오해하기 쉬운 점</p>
              <ul className="list-disc pl-5">
                {answer.cautions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold">참고 링크</p>
              <ul className="list-disc pl-5">
                {answer.recommended_sources.slice(0, Math.max(3, answer.recommended_sources.length)).map((item) => (
                  <li key={`${item.title}-${item.url}`}>
                    <a className="text-blue-700 underline" href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>{" "}
                    - {item.why}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <label className="block text-sm font-semibold">개인 메모</label>
              <textarea
                value={memoDraft}
                onChange={(event) => setMemoDraft(event.target.value)}
                className="mt-1 h-20 w-full rounded-md border p-2"
                placeholder="나만의 준비 메모를 남겨보세요"
              />
              <button
                type="button"
                onClick={addBookmark}
                className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-white"
              >
                즐겨찾기 저장
              </button>
            </div>
          </article>
        )}
      </section>

      <aside className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">즐겨찾기 / 메모</h2>
        <div className="mt-3 space-y-3">
          {bookmarks.length === 0 && <p className="text-sm text-slate-500">저장된 항목이 없습니다.</p>}
          {bookmarks.map((item) => (
            <div key={item.id} className="rounded-md border p-3">
              <p className="text-sm font-semibold">Q. {item.question}</p>
              <p className="mt-1 text-sm">요약: {item.answer.summary}</p>
              <textarea
                className="mt-2 h-20 w-full rounded-md border p-2 text-sm"
                value={item.memo}
                onChange={(event) => updateBookmarkMemo(item.id, event.target.value)}
              />
              <button
                type="button"
                onClick={() => removeBookmark(item.id)}
                className="mt-2 rounded-md bg-rose-600 px-3 py-1 text-sm text-white"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
