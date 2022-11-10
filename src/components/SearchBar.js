import { useState, useEffect } from "react";
import { getMyFriends } from "../api";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {}, searchTerm);

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a friend!"
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
      ></input>
    </div>
  );
};

export default SearchBar;
