"use client";

import { useEffect, useState } from "react";
import SearchSidebar from "./search";
import ListRest from "../restaurants/listRest";

const Content = () => {
  const [isPC, setIsPC] = useState(true);

  useEffect(() => {
    const check = () => setIsPC(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: isPC ? "row" : "column",
      }}
    >
      {/* Search */}
      <div
        style={{
          width: isPC ? "28%" : "95%",
          display: "flex",
          alignItems: isPC ? "center" : "flex-start",
          justifyContent: "center",
          padding: isPC ? "48px 40px" : "24px 16px",
        }}
      >
        <SearchSidebar />
      </div>

      {/* Restaurant list */}
      <div
        style={{
          width: isPC ? "72%" : "95%",
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: isPC ? "calc(100vh - 64px)" : "unset",
        }}
      >
        <ListRest />
      </div>
    </div>
  );
};

export default Content;
