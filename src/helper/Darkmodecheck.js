export const Darkmodecheck = (setdarkmode) => {
  if (localStorage.getItem("darkmode") === null) {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      localStorage.setItem("darkmode", "true");
      setdarkmode(true);
      document.body.style = "background: #101113;";
    } else {
      localStorage.setItem("darkmode", "false");
      setdarkmode(false);
      document.body.style = "background: #f0f2f5;";
    }
  } else {
    if (localStorage.getItem("darkmode") === "true") {
      setdarkmode(true);

      document.body.style = "background: #101113;";
    } else {
      setdarkmode(false);

      document.body.style = "background: #f0f2f5;";
    }
  }
};
