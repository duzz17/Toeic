(function () {
  const STORAGE_KEY = "toeic_cross_part_wrong_v1";

  function reportError(error) {
    console.error("Không thể cập nhật danh sách ôn câu sai:", error);
    window.dispatchEvent(
      new CustomEvent("toeic-review-error", {
        detail: { message: "Không lưu được tiến độ ôn câu sai trên trình duyệt." },
      }),
    );
    return false;
  }

  function readAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new TypeError("Dữ liệu ôn tập không đúng định dạng.");
    }
    return parsed;
  }

  function writeAll(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("toeic-review-change"));
  }

  function recordAnswer(question, selectedIndex) {
    try {
      if (
        !question ||
        typeof question.id !== "string" ||
        !question.id ||
        !Array.isArray(question.options) ||
        !Number.isInteger(question.correctIndex) ||
        !Number.isInteger(selectedIndex) ||
        !question.options[question.correctIndex] ||
        !question.options[selectedIndex]
      ) {
        throw new TypeError("Thiếu dữ liệu câu hỏi hoặc đáp án hợp lệ.");
      }

      const items = readAll();
      const existingIndex = items.findIndex((item) => item.id === question.id);
      if (selectedIndex === question.correctIndex) {
        if (existingIndex !== -1) {
          items.splice(existingIndex, 1);
          writeAll(items);
        }
        return true;
      }

      const previous = existingIndex === -1 ? null : items[existingIndex];
      const entry = {
        id: question.id,
        part: question.part,
        test: String(question.test || ""),
        number: String(question.number || ""),
        prompt: String(question.prompt || ""),
        options: question.options.map(String),
        correctIndex: question.correctIndex,
        selectedIndex,
        explanation: String(question.explanation || ""),
        context: String(question.context || ""),
        source: String(question.source || ""),
        wrongAttempts: (previous?.wrongAttempts || 0) + 1,
        firstWrongAt: previous?.firstWrongAt || new Date().toISOString(),
        lastWrongAt: new Date().toISOString(),
      };

      if (existingIndex === -1) items.push(entry);
      else items[existingIndex] = entry;
      writeAll(items);
      return true;
    } catch (error) {
      return reportError(error);
    }
  }

  function all() {
    return readAll().sort(
      (a, b) => new Date(b.lastWrongAt) - new Date(a.lastWrongAt),
    );
  }

  function remove(id) {
    try {
      const items = readAll();
      const remaining = items.filter((item) => item.id !== id);
      if (remaining.length !== items.length) writeAll(remaining);
      return true;
    } catch (error) {
      return reportError(error);
    }
  }

  function clear() {
    try {
      writeAll([]);
      return true;
    } catch (error) {
      return reportError(error);
    }
  }

  window.TOEICReviewStore = Object.freeze({
    all,
    clear,
    recordAnswer,
    remove,
  });

  window.addEventListener("toeic-review-error", (event) => {
    if (!document.body) return;
    const notice = document.createElement("div");
    notice.setAttribute("role", "alert");
    notice.textContent = event.detail.message;
    notice.style.cssText =
      "position:fixed;right:16px;bottom:16px;z-index:99999;max-width:320px;padding:12px 16px;border-radius:12px;background:#991b1b;color:white;font:600 13px/1.5 system-ui;box-shadow:0 8px 24px #0003";
    document.body.appendChild(notice);
    window.setTimeout(() => notice.remove(), 5000);
  });
})();
