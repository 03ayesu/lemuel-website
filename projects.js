/* Your work. Everything here is dummy text for now. Replace an entry and the card and its
   full case study page update together.

   name, title, type ("Mobile app", "Web app", "Dashboard", "Website"), year, role, client,
   timeline, tools: ["..."], summary, challenge, approach,
   steps: [{ title, text }], results: [{ value, suffix, label }], quote: { text, name, role },
   image: "assets/work/name.png" (replaces the drawn mockup), link: "https://..." (optional)
*/
(function () {
  var A = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  var B = "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  var C = "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
  var D = "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  function demo(name, type, year, title) {
    return {
      name: name, title: title, type: type, year: year, role: "Lorem ipsum dolor", client: "Sit amet elit", timeline: "Sed do eiusmod",
      tools: ["Lorem", "Ipsum", "Dolor"], summary: A, challenge: A + " " + B, approach: C + " " + D,
      steps: [{ title: "Lorem ipsum", text: A }, { title: "Dolor sit amet", text: B }, { title: "Consectetur elit", text: C }, { title: "Sed eiusmod", text: D }],
      results: [{ value: 42, suffix: "%", label: "Lorem ipsum dolor" }, { value: 18, suffix: "k", label: "Sit amet elit" }, { value: 7, suffix: "x", label: "Sed do eiusmod" }],
      quote: { text: B + " " + C, name: "Lorem Ipsum", role: "Dolor sit amet" }
    };
  }
  window.PROJECTS = [
    demo("Lorem Ipsum", "Mobile app", "2026", "Lorem ipsum dolor sit amet consectetur adipiscing."),
    demo("Dolor Sit", "Web app", "2026", "Sed do eiusmod tempor incididunt ut labore."),
    demo("Amet Elit", "Dashboard", "2025", "Ut enim ad minim veniam quis nostrud."),
    demo("Sed Eiusmod", "Mobile app", "2025", "Duis aute irure dolor in reprehenderit voluptate."),
    demo("Tempor Magna", "Website", "2025", "Excepteur sint occaecat cupidatat non proident."),
    demo("Labore Aliqua", "Web app", "2024", "Nulla pariatur sunt in culpa qui officia."),
    demo("Minim Veniam", "Mobile app", "2024", "Quis nostrud exercitation ullamco laboris nisi.")
  ];
})();
