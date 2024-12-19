import React from "react";
import "../../styles/Search.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const handleSearchIcon = () => {
    console.log("clicked search Icon");
  };

  return (
    <>
      <div className="search-main">
        <div className="search-content-container">
          <input
            className="form-control me-2 search-input"
            type="search"
            placeholder="Search Movies"
            aria-label="Search"
          />
          <span className="search-icon">
            <FontAwesomeIcon
              icon={faSearch}
              onClick={handleSearchIcon}
              style={{color:"red"}}
            />
          </span>
        </div>
      </div>
    </>
  );
};

export default Search;
