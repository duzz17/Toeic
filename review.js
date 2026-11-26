function plainText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .trim();
}

function renderWrongAnswers() {
  const store = window.TOEICReviewStore;
  const container = document.getElementById("wrong-list");
  const partFilter = document.getElementById("part-filter").value;
  let items;
  try {
    items = store
      .all()
      .filter((item) => partFilter === "all" || String(item.part) === partFilter);
  } catch (error) {
    console.error("Không thể đọc danh sách ôn câu sai:", error);
    document.getElementById("wrong-count").textContent = "";
    container.replaceChildren();
    const notice = document.createElement("p");
    notice.className = "empty";
    notice.setAttribute("role", "alert");
    notice.textContent =
      "Không đọc được dữ liệu ôn tập. Hãy thử xóa danh sách để tạo lại dữ liệu mới.";
    container.append(notice);
    return;
  }

  document.getElementById("wrong-count").textContent =
    `${items.length} câu cần ôn`;
  container.replaceChildren();

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.innerHTML =
      "<strong>Chưa có câu sai cần ôn.</strong><p class=\"muted\">Hãy luyện tập ở các Part; câu trả lời sai sẽ tự xuất hiện tại đây.</p>";
    container.appendChild(empty);
    return;
  }

  for (const item of items) {
    const card = document.createElement("article");
    card.className = "card";

    const meta = document.createElement("div");
    meta.className = "meta";
    const part = document.createElement("span");
    part.className = "tag";
    part.textContent = `Part ${item.part}`;
    meta.append(part);
    if (item.test) {
      const test = document.createElement("span");
      test.textContent = item.test;
      meta.append(test);
    }
    if (item.number) {
      const number = document.createElement("span");
      number.textContent = `Câu ${item.number}`;
      meta.append(number);
    }
    const attempts = document.createElement("span");
    attempts.textContent = `Sai ${item.wrongAttempts} lần`;
    meta.append(attempts);
    card.append(meta);

    const question = document.createElement("h2");
    question.textContent = item.prompt;
    card.append(question);
    if (item.context) {
      const context = document.createElement("p");
      context.className = "context";
      context.textContent = plainText(item.context);
      card.append(context);
    }

    const options = document.createElement("div");
    options.className = "options";
    const feedback = document.createElement("div");
    feedback.className = "feedback";
    const mastered = document.createElement("button");
    mastered.className = "mastered";
    mastered.type = "button";
    mastered.textContent = "Đã nhớ — bỏ khỏi danh sách";

    item.options.forEach((optionText, index) => {
      const option = document.createElement("button");
      option.className = "option";
      option.type = "button";
      option.textContent = `${String.fromCharCode(65 + index)}. ${optionText}`;
      option.addEventListener("click", () => {
        options.querySelectorAll("button").forEach((button) => {
          button.disabled = true;
        });
        if (index === item.correctIndex) {
          option.classList.add("correct");
          feedback.textContent = "Chính xác!";
          if (item.explanation) {
            feedback.textContent += ` ${plainText(item.explanation)}`;
          }
          mastered.style.display = "inline-block";
        } else {
          option.classList.add("incorrect");
          const correct = options.children[item.correctIndex];
          correct.classList.add("correct");
          feedback.textContent = `Chưa đúng. Đáp án đúng là ${String.fromCharCode(65 + item.correctIndex)}.`;
          if (item.explanation) {
            feedback.textContent += ` ${plainText(item.explanation)}`;
          }
          store.recordAnswer(item, index);
        }
      });
      options.append(option);
    });

    mastered.addEventListener("click", () => {
      store.remove(item.id);
      renderWrongAnswers();
    });

    card.append(options, feedback, mastered);
    container.append(card);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("part-filter")
    .addEventListener("change", renderWrongAnswers);
  document.getElementById("clear-wrong").addEventListener("click", () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ danh sách câu sai?")) {
      window.TOEICReviewStore.clear();
      renderWrongAnswers();
    }
  });
  renderWrongAnswers();
});
