import type React from "react";
import nowtedLogo from "../assets/nowted-logo.svg";
import searchIcon from "../assets/search-icon.svg";
import activeSearchIcon from "../assets/active_search_logo.svg";
import darkModeImage from "../assets/dark-mode.svg";
import lightModeImage from "../assets/light-mode.svg";
import { useEffect, useState } from "react";

export function Logo({
  toggleSearch,
  setToggleSearch,
}: {
  toggleSearch: boolean;
  setToggleSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="flex justify-between items-center px-[6%] py-2">
      <img src={nowtedLogo} alt="nowted-logo" className="w-25.25 h-9.5 invert dark:invert-0" />
      
      <img src={isDark ? darkModeImage : lightModeImage } className="w-14" onClick={() => { setIsDark(prev => !prev) }} />

      <img
        src={toggleSearch ? searchIcon : activeSearchIcon}
        alt="search-icon"
        className="w-5 h-5 cursor-pointer  invert dark:invert-0"
        onClick={() => {
          setToggleSearch((prev) => !prev);
        }}
      />
    </div>
  );
}
