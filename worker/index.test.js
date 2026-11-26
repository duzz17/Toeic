import assert from "node:assert/strict";
import test from "node:test";
import worker from "./index.js";

const origin = "https://duzz17.github.io";
const env = {
  ALLOWED_ORIGIN: origin,
  GEMINI_API_KEY: "test-gemini-key",
  WORKER_ACCESS_TOKEN: "test-access-token",
};

function request(path, options = {}) {
  return new Request(`https://worker.example${path}`, {
    ...options,
    headers: {
      Origin: origin,
      ...(options.headers || {}),
    },
  });
}

test("allows the configured website to make a CORS preflight request", async () => {
  const result = await worker.fetch(
    request("/api/generate", { method: "OPTIONS" }),
    env,
  );

  assert.equal(result.status, 204);
  assert.equal(result.headers.get("Access-Control-Allow-Origin"), origin);
});

test("rejects requests from origins outside the allowlist", async () => {
  const result = await worker.fetch(
    new Request("https://worker.example/api/generate", {
      method: "POST",
      headers: { Origin: "https://example.invalid" },
    }),
    env,
  );

  assert.equal(result.status, 403);
  assert.equal(result.headers.get("Access-Control-Allow-Origin"), null);
});

test("requires the Worker access token before parsing uploaded material", async () => {
  const result = await worker.fetch(
    request("/api/generate", {
      method: "POST",
      headers: { Authorization: "Bearer wrong-token" },
      body: new FormData(),
    }),
    env,
  );

  assert.equal(result.status, 401);
  assert.match((await result.json()).error, /token/i);
});

test("validates the generated question set and deletes its temporary Gemini file", async () => {
  const originalFetch = globalThis.fetch;
  const generated = {
    title: "Test set",
    questions: Array.from({ length: 3 }, (_, index) => ({
      question: `Question ${index + 1}?`,
      options: ["A", "B", "C", "D"],
      answerIndex: 1,
      explanation: "Evidence from the material.",
    })),
  };
  let interactionBody;
  let fileDeleted = false;

  globalThis.fetch = async (input, init = {}) => {
    const url = String(input);
    if (url === "https://generativelanguage.googleapis.com/upload/v1beta/files") {
      return new Response(null, {
        status: 200,
        headers: { "x-goog-upload-url": "https://upload.example/file" },
      });
    }
    if (url === "https://upload.example/file") {
      return new Response(
        JSON.stringify({
          file: {
            uri: "https://generativelanguage.googleapis.com/files/temporary-id",
            name: "files/temporary-id",
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    if (url.endsWith("/v1beta/interactions")) {
      interactionBody = JSON.parse(init.body);
      return new Response(
        JSON.stringify({ output_text: JSON.stringify(generated) }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    if (url.endsWith("/v1beta/files/temporary-id") && init.method === "DELETE") {
      fileDeleted = true;
      return new Response(null, { status: 204 });
    }
    throw new Error(`Unexpected Gemini request: ${url}`);
  };

  try {
    const form = new FormData();
    form.set("file", new File(["%PDF-1.4"], "lesson.pdf", { type: "application/pdf" }));
    form.set("part", "7");
    form.set("testName", "Unit test");
    form.set("questionCount", "3");

    const result = await worker.fetch(
      request("/api/generate", {
        method: "POST",
        headers: { Authorization: "Bearer test-access-token" },
        body: form,
      }),
      env,
    );
    const body = await result.json();

    assert.equal(result.status, 200);
    assert.equal(body.questions.length, 3);
    assert.equal(body.questions[0].answerIndex, 1);
    assert.equal(interactionBody.store, false);
    assert.equal(interactionBody.response_format.mime_type, "application/json");
    assert.equal(fileDeleted, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
