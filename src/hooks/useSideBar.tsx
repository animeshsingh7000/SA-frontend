import { useState } from "react";

export default function useSideBar() {
  const [expendMenu, setExpendMenu] = useState(false);

  function toggleMenuExpend() {
    setExpendMenu(!expendMenu);
  }

  return {
    toggleMenuExpend,
    expendMenu,
  };
}
