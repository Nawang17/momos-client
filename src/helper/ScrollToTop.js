import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: -50,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}
