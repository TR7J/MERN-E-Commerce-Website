import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Navbar/Navbar.css";
export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    navigate(query ? `/search?query=${query}` : "/search");
  };
  return (
    <form onSubmit={submitHandler}>
      <div>
        <input
          type="text"
          name="q"
          id="q"
          placeholder="Explore Mot Du Jour"
          aria-label="Mot Du Jour"
          className="search-input"
          aria-describedby="button-search"
          onChange={(e) => setQuery(e.target.value)}
        ></input>
        <button type="submit" id="button-search" className="search-button">
          {/* <i className="fas fa-search"></i> */}
          Search
        </button>
      </div>
    </form>
  );
}
