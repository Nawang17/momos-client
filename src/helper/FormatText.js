import reactStringReplace from "react-string-replace";

export const formatText = (text, navigate) => {
  let replacedText;

  // Match URLs
  replacedText = reactStringReplace(text, /(https?:\/\/\S+)/g, (match, i) => (
    <span
      onClick={(e) => {
        e.stopPropagation();
        window.open(match, "_blank");
      }}
      className="link-style"
      style={{
        color: "#1d9bf0",
      }}
      key={match + i}
    >
      {match}
    </span>
  ));

  // Match @-mentions

  replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) => (
    <span
      className="link-style"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/${match}`);
      }}
      style={{ color: "#1d9bf0" }}
      key={match + i}
    >
      @{match}
    </span>
  ));

  // Match hashtags
  replacedText = reactStringReplace(replacedText, /#(\w+)/g, (match, i) => (
    <span
      className="link-style"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/search/q/%23${match}`);
      }}
      style={{ color: "#1d9bf0" }}
      key={match + i}
    >
      #{match}
    </span>
  ));

  return replacedText;
};
