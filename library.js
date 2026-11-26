(function () {
  const database = window.TOEICLibraryDB;
  const PART_NAMES = {
    1: "Photographs",
    2: "Question-Response",
    3: "Conversations",
    4: "Talks",
    5: "Incomplete Sentences",
    6: "Text Completion",
    7: "Reading Comprehension",
  };
  let draft = null;
  let activePractice = null;
  let audioUrls = [];

  function makeId() {
    return window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function setStatus(elementId, message, kind) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `status${kind ? ` ${kind}` : ""}`;
  }

  function showError(elementId, error) {
    console.error(error);
    setStatus(
      elementId,
      error && error.message ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại.",
      "error",
    );
  }

  function escapeText(value) {
    return String(value == null ? "" : value);
  }

  function displayDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleString("vi-VN");
  }

  function getWorkerConfig() {
    const input = document.getElementById("worker-url").value.trim();
    const token = document.getElementById("worker-token").value.trim();
    let url;
    try {
      url = new URL(input);
    } catch {
      throw new Error("Hãy nhập URL Worker hợp lệ.");
    }

    const isLocal = ["localhost", "127.0.0.1"].includes(url.hostname);
    if (
      (url.protocol !== "https:" && !(isLocal && url.protocol === "http:")) ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      throw new Error("Hãy nhập URL gốc HTTPS của Worker (không kèm đường dẫn).");
    }
    if (!token) throw new Error("Hãy nhập access token của Worker.");
    return { baseUrl: url.origin, token };
  }

  async function loadWorkerConfig() {
    const savedUrl = sessionStorage.getItem("toeic_worker_url");
    const savedToken = sessionStorage.getItem("toeic_worker_token");
    if (savedUrl) document.getElementById("worker-url").value = savedUrl;
    if (savedToken) document.getElementById("worker-token").value = savedToken;
    setStatus(
      "worker-status",
      savedUrl && savedToken
        ? "Đã lưu cấu hình trong phiên trình duyệt này."
        : "Chưa kết nối. Nhập URL và access token để sử dụng tính năng AI.",
    );
  }

  async function saveWorkerConfig() {
    try {
      const { baseUrl, token } = getWorkerConfig();
      sessionStorage.setItem("toeic_worker_url", baseUrl);
      sessionStorage.setItem("toeic_worker_token", token);
      setStatus("worker-status", "Đã lưu cấu hình trong phiên trình duyệt này.", "success");
    } catch (error) {
      showError("worker-status", error);
    }
  }

  function makeActionButton(text, className, handler) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    if (className) button.className = className;
    button.addEventListener("click", handler);
    return button;
  }

  async function renderMaterials() {
    const container = document.getElementById("materials-list");
    audioUrls.forEach((url) => URL.revokeObjectURL(url));
    audioUrls = [];
    container.replaceChildren();

    try {
      const materials = (await database.getMaterials()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      if (!materials.length) {
        container.textContent = "Chưa có tài liệu. Hãy thêm file ở phía trên.";
        container.className = "muted";
        return;
      }
      container.className = "";

      for (const material of materials) {
        const card = document.createElement("article");
        card.className = "item";
        const head = document.createElement("div");
        head.className = "item-head";
        const details = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = material.name;
        const meta = document.createElement("div");
        meta.className = "item-meta";
        meta.textContent = `Part ${material.part} — ${PART_NAMES[material.part] || ""}${
          material.testName ? ` · ${material.testName}` : ""
        } · ${(material.size / (1024 * 1024)).toFixed(2)} MB · ${displayDate(material.createdAt)}`;
        details.append(title, meta);

        const actions = document.createElement("div");
        actions.className = "actions";
        const generateButton = makeActionButton(
          "Tạo câu hỏi bằng Gemini",
          "",
          () => generateQuestionSet(material, generateButton),
        );
        actions.append(
          generateButton,
          makeActionButton("Xóa", "danger", async () => {
            if (!window.confirm(`Xóa tài liệu "${material.name}" khỏi trình duyệt này?`)) {
              return;
            }
            try {
              await database.deleteMaterial(material.id);
              await renderMaterials();
              setStatus("material-status", "Đã xóa tài liệu.", "success");
            } catch (error) {
              showError("material-status", error);
            }
          }),
        );
        head.append(details);
        card.append(head);
        if (material.type.startsWith("audio/")) {
          const audio = document.createElement("audio");
          audio.controls = true;
          const objectUrl = URL.createObjectURL(material.file);
          audioUrls.push(objectUrl);
          audio.src = objectUrl;
          card.append(audio);
        } else {
          const link = document.createElement("a");
          link.className = "preview-link";
          link.textContent = "Mở/xem tài liệu";
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          const objectUrl = URL.createObjectURL(material.file);
          audioUrls.push(objectUrl);
          link.href = objectUrl;
          card.append(link);
        }
        card.append(actions);
        container.append(card);
      }
    } catch (error) {
      showError("material-status", error);
      container.textContent = "Không tải được danh sách tài liệu.";
    }
  }

  async function handleMaterialSubmit(event) {
    event.preventDefault();
    const input = document.getElementById("material-file");
    const file = input.files && input.files[0];
    if (!file) return;

    const material = {
      id: makeId(),
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      part: Number(document.getElementById("material-part").value),
      testName: document.getElementById("material-test").value.trim(),
      createdAt: new Date().toISOString(),
      file,
    };
    try {
      await database.saveMaterial(material);
      event.target.reset();
      await renderMaterials();
      setStatus("material-status", "Đã lưu tài liệu trên trình duyệt này.", "success");
    } catch (error) {
      showError("material-status", error);
    }
  }

  async function generateQuestionSet(material, action) {
    let config;
    try {
      config = getWorkerConfig();
    } catch (error) {
      showError("worker-status", error);
      return;
    }

    if (action) action.disabled = true;
    setStatus(
      "material-status",
      `Đang gửi "${material.name}" tới Gemini để tạo câu hỏi. Vui lòng chờ...`,
    );

    try {
      const form = new FormData();
      form.append("file", material.file, material.name);
      form.append("part", String(material.part));
      form.append("testName", material.testName);
      form.append(
        "questionCount",
        document.getElementById("question-count").value,
      );
      const response = await fetch(`${config.baseUrl}/api/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${config.token}` },
        body: form,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          payload && payload.error
            ? payload.error
            : `Worker trả về lỗi HTTP ${response.status}.`,
        );
      }
      if (
        !payload ||
        typeof payload.title !== "string" ||
        !Array.isArray(payload.questions)
      ) {
        throw new Error("Worker trả về bộ câu hỏi không đúng định dạng.");
      }

      draft = {
        id: makeId(),
        title: payload.title,
        part: material.part,
        testName: material.testName,
        sourceMaterialId: material.id,
        sourceMaterialName: material.name,
        createdAt: new Date().toISOString(),
        questions: payload.questions.map((question) => ({
          id: makeId(),
          question: escapeText(question.question),
          options: Array.isArray(question.options)
            ? question.options.map(escapeText)
            : [],
          answerIndex: question.answerIndex,
          explanation: escapeText(question.explanation),
        })),
      };
      renderDraft();
      setStatus(
        "material-status",
        payload.warning
          ? `${payload.warning} Bản nháp đã được nhận, hãy kiểm tra trước khi lưu.`
          : "Đã nhận bản nháp từ AI. Kiểm tra nội dung trước khi lưu.",
        payload.warning ? "error" : "success",
      );
      document.getElementById("draft-panel").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      showError("material-status", error);
    } finally {
      if (action) action.disabled = false;
    }
  }

  function renderDraft() {
    const panel = document.getElementById("draft-panel");
    const container = document.getElementById("draft-questions");
    container.replaceChildren();
    if (!draft) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    document.getElementById("draft-title").value = draft.title;

    draft.questions.forEach((question, questionIndex) => {
      const card = document.createElement("article");
      card.className = "question-edit";
      const questionLabel = document.createElement("label");
      questionLabel.textContent = `Câu ${questionIndex + 1}`;
      const questionInput = document.createElement("textarea");
      questionInput.dataset.field = "question";
      questionInput.value = question.question;
      questionLabel.append(questionInput);
      card.append(questionLabel);

      const options = document.createElement("div");
      options.className = "options-edit";
      question.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        label.className = "option-edit";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `answer-${question.id}`;
        radio.value = String(optionIndex);
        radio.checked = optionIndex === question.answerIndex;
        const input = document.createElement("input");
        input.type = "text";
        input.value = option;
        input.dataset.field = "option";
        input.dataset.index = String(optionIndex);
        input.setAttribute("aria-label", `Câu ${questionIndex + 1}, đáp án ${optionIndex + 1}`);
        label.append(radio, input);
        options.append(label);
      });
      card.append(options);

      const explanationLabel = document.createElement("label");
      explanationLabel.textContent = "Giải thích";
      const explanation = document.createElement("textarea");
      explanation.dataset.field = "explanation";
      explanation.value = question.explanation;
      explanationLabel.append(explanation);
      card.append(explanationLabel);
      container.append(card);
    });
  }

  function readDraft() {
    const cards = Array.from(
      document.querySelectorAll("#draft-questions .question-edit"),
    );
    const title = document.getElementById("draft-title").value.trim();
    if (!title) throw new Error("Tên bộ câu hỏi không được để trống.");
    if (!cards.length) throw new Error("Bản nháp chưa có câu hỏi.");

    const questions = cards.map((card, index) => {
      const question = card.querySelector('[data-field="question"]').value.trim();
      const options = Array.from(
        card.querySelectorAll('[data-field="option"]'),
      ).map((input) => input.value.trim());
      const selectedAnswer = card.querySelector('input[type="radio"]:checked');
      const explanation = card
        .querySelector('[data-field="explanation"]')
        .value.trim();
      if (
        !question ||
        options.some((option) => !option) ||
        !selectedAnswer ||
        !explanation
      ) {
        throw new Error(`Hãy điền đầy đủ nội dung, đáp án và giải thích ở câu ${index + 1}.`);
      }
      return {
        id: draft.questions[index].id,
        question,
        options,
        answerIndex: Number(selectedAnswer.value),
        explanation,
      };
    });
    return { ...draft, title, questions };
  }

  async function saveDraft() {
    try {
      const questionSet = readDraft();
      await database.saveQuestionSet(questionSet);
      draft = null;
      renderDraft();
      await renderQuestionSets();
      setStatus("draft-status", "Đã lưu bộ câu hỏi trong thư viện.", "success");
    } catch (error) {
      showError("draft-status", error);
    }
  }

  async function renderQuestionSets() {
    const container = document.getElementById("question-sets");
    container.replaceChildren();
    try {
      const sets = (await database.getQuestionSets()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      if (!sets.length) {
        container.textContent = "Chưa có bộ câu hỏi. Tạo câu hỏi từ một tài liệu để bắt đầu.";
        container.className = "muted";
        return;
      }
      container.className = "";
      for (const questionSet of sets) {
        const card = document.createElement("article");
        card.className = "item";
        const head = document.createElement("div");
        head.className = "item-head";
        const details = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = questionSet.title;
        const meta = document.createElement("div");
        meta.className = "item-meta";
        meta.textContent = `Part ${questionSet.part} · ${questionSet.questions.length} câu${
          questionSet.testName ? ` · ${questionSet.testName}` : ""
        } · ${displayDate(questionSet.createdAt)}`;
        details.append(title, meta);

        const actions = document.createElement("div");
        actions.className = "actions";
        actions.append(
          makeActionButton("Luyện tập", "", () => startPractice(questionSet)),
          makeActionButton("Xóa", "danger", async () => {
            if (!window.confirm(`Xóa bộ câu hỏi "${questionSet.title}"?`)) return;
            try {
              await database.deleteQuestionSet(questionSet.id);
              await renderQuestionSets();
            } catch (error) {
              showError("draft-status", error);
            }
          }),
        );
        head.append(details);
        card.append(head, actions);
        container.append(card);
      }
    } catch (error) {
      showError("draft-status", error);
      container.textContent = "Không tải được danh sách bộ câu hỏi.";
    }
  }

  function startPractice(questionSet) {
    activePractice = {
      questionSet,
      index: 0,
      selectedIndex: null,
      checked: false,
    };
    document.getElementById("practice-panel").hidden = false;
    document.getElementById("practice-title").textContent = questionSet.title;
    document.getElementById("practice-panel").scrollIntoView({ behavior: "smooth" });
    renderPracticeQuestion();
  }

  function renderPracticeQuestion() {
    if (!activePractice) return;
    const { questionSet, index } = activePractice;
    const question = questionSet.questions[index];
    const container = document.getElementById("practice-question");
    container.replaceChildren();
    document.getElementById("practice-progress").textContent =
      `Câu ${index + 1} / ${questionSet.questions.length} · Part ${questionSet.part}`;
    document.getElementById("check-practice-answer").hidden = false;
    document.getElementById("check-practice-answer").disabled = false;
    document.getElementById("next-practice-question").hidden = true;
    setStatus("practice-status", "");

    const card = document.createElement("article");
    card.className = "practice-question";
    const prompt = document.createElement("h3");
    prompt.textContent = question.question;
    card.append(prompt);
    question.options.forEach((optionText, optionIndex) => {
      const option = makeActionButton(
        `${String.fromCharCode(65 + optionIndex)}. ${optionText}`,
        "practice-option",
        () => {
          if (activePractice.checked) return;
          activePractice.selectedIndex = optionIndex;
          card.querySelectorAll(".practice-option").forEach((button) => {
            button.classList.remove("selected");
          });
          card.children[optionIndex + 1].classList.add("selected");
        },
      );
      card.append(option);
    });
    container.append(card);
  }

  function checkPracticeAnswer() {
    if (!activePractice || activePractice.selectedIndex === null) {
      setStatus("practice-status", "Hãy chọn một đáp án trước.", "error");
      return;
    }
    const { questionSet, index, selectedIndex } = activePractice;
    const question = questionSet.questions[index];
    const isCorrect = selectedIndex === question.answerIndex;
    activePractice.checked = true;
    const buttons = document.querySelectorAll(
      "#practice-question .practice-option",
    );
    buttons.forEach((button, optionIndex) => {
      button.disabled = true;
      if (optionIndex === question.answerIndex) button.classList.add("correct");
      else if (optionIndex === selectedIndex) button.classList.add("incorrect");
    });

    const answerRecord = {
      id: `library-${questionSet.id}-${question.id}`,
      part: questionSet.part,
      test: questionSet.testName || questionSet.title,
      number: String(index + 1),
      prompt: question.question,
      options: question.options,
      correctIndex: question.answerIndex,
      explanation: question.explanation,
      context: `Bộ câu hỏi: ${questionSet.title}`,
      source: "library",
    };
    const reviewSaved = window.TOEICReviewStore.recordAnswer(
      answerRecord,
      selectedIndex,
    );

    const feedback = document.createElement("p");
    feedback.className = "feedback";
    feedback.textContent = `${isCorrect ? "Chính xác!" : `Chưa đúng. Đáp án là ${String.fromCharCode(65 + question.answerIndex)}.`} ${question.explanation}`;
    document.getElementById("practice-question").append(feedback);
    document.getElementById("check-practice-answer").hidden = true;
    document.getElementById("next-practice-question").hidden = false;
    setStatus(
      "practice-status",
      isCorrect
        ? "Câu trả lời đúng."
        : reviewSaved
          ? "Câu trả lời sai đã được thêm vào trang Ôn câu sai."
          : "Câu trả lời sai; không lưu được vào trang Ôn câu sai.",
      isCorrect ? "success" : "error",
    );
  }

  function nextPracticeQuestion() {
    if (!activePractice) return;
    activePractice.index += 1;
    if (activePractice.index >= activePractice.questionSet.questions.length) {
      activePractice = null;
      document.getElementById("practice-panel").hidden = true;
      setStatus("draft-status", "Đã hoàn thành bộ luyện tập.", "success");
      return;
    }
    activePractice.selectedIndex = null;
    activePractice.checked = false;
    renderPracticeQuestion();
  }

  function closePractice() {
    activePractice = null;
    document.getElementById("practice-panel").hidden = true;
  }

  function reportReviewErrors() {
    window.addEventListener("toeic-review-error", (event) => {
      setStatus("practice-status", event.detail.message, "error");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadWorkerConfig();
    renderMaterials();
    renderQuestionSets();
    reportReviewErrors();
    document
      .getElementById("save-worker")
      .addEventListener("click", saveWorkerConfig);
    document
      .getElementById("material-form")
      .addEventListener("submit", handleMaterialSubmit);
    document
      .getElementById("save-question-set")
      .addEventListener("click", saveDraft);
    document.getElementById("discard-draft").addEventListener("click", () => {
      draft = null;
      renderDraft();
      setStatus("draft-status", "Đã bỏ bản nháp.");
    });
    document
      .getElementById("check-practice-answer")
      .addEventListener("click", checkPracticeAnswer);
    document
      .getElementById("next-practice-question")
      .addEventListener("click", nextPracticeQuestion);
    document
      .getElementById("close-practice")
      .addEventListener("click", closePractice);
  });
})();
