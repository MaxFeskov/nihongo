(async () => {
  document.querySelectorAll(".key").forEach((node) => {
    switch (node.dataset.id) {
      case "menu":
        node.innerHTML = "&#9776;";
        break;

      case "backspace":
        node.innerHTML = "&#8592;";
        break;

      case "enter":
        node.innerHTML = "&#8629";
        break;

      case "left-shift":
      case "right-shift":
        node.innerHTML = "&#8679;";
        break;

      case "left-ctrl":
      case "right-ctrl":
        node.innerHTML = "ctrl";
        break;

      case "caps-lock":
        node.innerHTML = "&#8682;";
        break;

      case "win":
        node.innerHTML = "&#8862;";
        break;

      case "space":
        node.innerHTML = "";
        break;

      default:
        node.innerHTML = node.dataset.id;
    }
  });
})();
