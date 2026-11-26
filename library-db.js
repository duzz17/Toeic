(function () {
  const DATABASE_NAME = "toeic-learning-library";
  const DATABASE_VERSION = 1;
  let databasePromise;

  function openDatabase() {
    if (!databasePromise) {
      databasePromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        request.onupgradeneeded = () => {
          const database = request.result;
          if (!database.objectStoreNames.contains("materials")) {
            database.createObjectStore("materials", { keyPath: "id" });
          }
          if (!database.objectStoreNames.contains("questionSets")) {
            database.createObjectStore("questionSets", { keyPath: "id" });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () =>
          reject(new Error("Đang có tab khác chặn cập nhật thư viện tài liệu."));
      });
    }
    return databasePromise;
  }

  async function runTransaction(storeName, mode, action) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, mode);
      const request = action(transaction.objectStore(storeName));
      let result;
      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  window.TOEICLibraryDB = Object.freeze({
    deleteMaterial: (id) =>
      runTransaction("materials", "readwrite", (store) => store.delete(id)),
    deleteQuestionSet: (id) =>
      runTransaction("questionSets", "readwrite", (store) => store.delete(id)),
    getMaterial: (id) =>
      runTransaction("materials", "readonly", (store) => store.get(id)),
    getMaterials: () =>
      runTransaction("materials", "readonly", (store) => store.getAll()),
    getQuestionSet: (id) =>
      runTransaction("questionSets", "readonly", (store) => store.get(id)),
    getQuestionSets: () =>
      runTransaction("questionSets", "readonly", (store) => store.getAll()),
    saveMaterial: (material) =>
      runTransaction("materials", "readwrite", (store) => store.put(material)),
    saveQuestionSet: (questionSet) =>
      runTransaction("questionSets", "readwrite", (store) =>
        store.put(questionSet),
      ),
  });
})();
