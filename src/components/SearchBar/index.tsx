import { useEffect, useState } from "react";
import iconSearch from "../../assets/images/iconSearch.svg";
import { useSearchParams } from "react-router-dom";
import { Any } from "../../types/global.type";

export default function SearchBar({ placeHolder, activeTab }: { placeHolder: string, activeTab?:string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");

  const searchData = (e: Any) => {
    e.preventDefault();
    searchParams.set("query", query);
    setSearchParams(searchParams);
  };

  const removeData = (e: Any) => {
    e.preventDefault();
    searchParams.set("query", "");
    setQuery("");
    setSearchParams(searchParams);
  };

  const setSearchData = (value: string) => {
    if (!value) {
      searchParams.delete("query");
      setSearchParams(searchParams);
    }
    setQuery(value);
  };


  useEffect(() => {
    const searchValue = searchParams.get("query");
    searchValue && setQuery(searchValue);
  }, [searchParams]);

  useEffect(() => {
    // if(activeTab){
      setQuery("");
      searchParams.delete("query");
      setSearchParams(searchParams);
    // }
    
  }, [activeTab]);

  return (
    <form className="search-bar">
      <div className="input-group rounded">
        <input
          className="form-control rounded"
          type="text"
          value={query}
          placeholder={placeHolder}
          aria-label="Search"
          onChange={(e) => setSearchData(e.target.value)}
        />
        {query ? <button className="input-group-text border-0 border-b-1 mb-20 _cross-search" onClick={removeData} type="button">
          <em className="icon-close search-map-clear"></em>
        </button>:null}
        <button
          className="input-group-text border-0 border-b-1 mb-20"
          id="search-addon"
          onClick={searchData}
          type="submit"
        >
          <em className="icon-search"></em>
        </button>
      </div>
    </form>
  );
}
