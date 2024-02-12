import { useRef, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const apiKey: string = "WPu8rR6id83D4Ubtn5ehAlOURrUXQWpX_e504s0qI_k";

  const [searchInput, setSearchInput] = useState<string>("");

  const [imgPage, setImgPage] = useState<number>(1);

  const [imgDataList, setImgDataList] = useState<
    { src: string; href: string; description: string }[]
  >([]);

  const [imgError, setImgError] = useState<string>("");

  const prevSearchInput = useRef<string>("");

  function onInputHandler(event: any) {
    setSearchInput(event);
  }

  async function searchImages(event: any) {
    try {
      event?.preventDefault();

      if (searchInput !== prevSearchInput.current) {
        setImgDataList([]);
        setImgPage(1);
      }

      prevSearchInput.current = searchInput;

      const url: string = `https://api.unsplash.com/search/photos?page=${imgPage}&query=${searchInput}&client_id=${apiKey}`;

      const apiResponse = await axios
        .get(url)
        .then((response) => response.data.results);

      if (apiResponse.length === 0) {
        setImgError("There is no Image with that Name Tag");
        setImgDataList([]);
      } else {
        setImgError("");
      }

      const apiDataWeNeed = apiResponse.map((item: any) => ({
        src: item.urls.small,
        href: item.links.html,
        description: item.alt_description,
      }));

      if (searchInput === prevSearchInput.current) {
        setImgDataList((prevApiData) => [...prevApiData, ...apiDataWeNeed]);
      } else {
        setImgDataList(apiDataWeNeed);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }

    setImgPage((prevValue) => (prevValue += 1));

    console.log(searchInput);
  }

  function showMore(event: any) {
    searchImages(event);
  }

  return (
    <div className="container">
      <h1 className="title">Image Search App</h1>

      <form className="form_element">
        <input
          onChange={(event) => onInputHandler(event.target.value)}
          value={searchInput}
          id="search_input"
          type="text"
          placeholder="Search..."
        />

        <button onClick={(event) => searchImages(event)} id="search_btn">
          Search
        </button>
      </form>

      {imgError && <h1 className="error_h1">{imgError}</h1>}

      <div className="search_results">
        {imgDataList.map((item: any, index: number) => (
          <div key={`a` + index} className="search_card_result">
            <div key={`b` + index} className="image_container">
              <img
                className="search_card_img"
                key={`c` + index}
                src={item.src}
                alt="img"
              />
            </div>
            <div key={`d` + index} className="link_container">
              <a
                className="search_card_link"
                key={`e` + index}
                href={item.href}
                target="_blank"
              >
                {item.description}
              </a>
            </div>
          </div>
        ))}
      </div>

      <button
        style={{ display: imgDataList.length >= 1 ? "block" : "none" }}
        onClick={(event) => showMore(event)}
        id="show_more_btn"
      >
        Show More
      </button>
    </div>
  );
}

export default App;
