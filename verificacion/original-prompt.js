const options = {
  expectedInputs:  [{ type: "text", languages: ["es"] }],
  expectedOutputs: [{ type: "text", languages: ["es"] }],
};

prepareButton.addEventListener("click", async () => {
  if (!("LanguageModel" in self)) return showManual();
  const state = await LanguageModel.availability(options);
  if (state === "unavailable") return showManual();

  const session = await LanguageModel.create({
    ...options,
    monitor(m) {
      m.addEventListener("downloadprogress", (e) => {
        progress.value = e.loaded; // 0 a 1
      });
    },
  });

  const answer = await session.prompt("Resume estas notas en español:\n" + notes.value);
  showEditableAnswer(answer);
});
