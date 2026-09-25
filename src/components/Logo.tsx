import type React from "react";
import nowtedLogo from "../assets/nowted-logo.svg";
import searchIcon from "../assets/search-icon.svg";

export function Logo({
  setToggleSearch,
}: {
  setToggleSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex justify-between items-center px-[6%] py-2">
      <img src={nowtedLogo} alt="nowted-logo" className="w-25.25 h-9.5" />
      <img
        src={searchIcon}
        alt="search-icon"
        className="w-5 h-5"
        onClick={() => {
          setToggleSearch((prev) => !prev);
        }}
      />
    </div>
  );
}
