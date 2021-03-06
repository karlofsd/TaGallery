import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import socket from "./socket";

function App() {
  const [tags, setTags] = useState([]);
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState({
    add: "",
    edit: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageOptions, setPageOptions] = useState({
    pages: "",
    limit: 10,
  });

  const [api, setApi] = useState(false);

  useEffect(() => {
    !tags[0] ? getTags() : console.log("render");
  }, []);

  useEffect(() => {
    socket.on("tags", (_) => {
      tagsPage();
    });

    return () => socket.off();
  }, [tags]);

  useEffect(() => {
    !api && getTags();
  }, [api]);

  const randomColor = () => {
    let rgb = [];
    let count = 0;
    while (count < 3) {
      let tone = Math.floor(Math.random() * (255 - 0)) + 0;
      rgb.push(tone);
      count++;
    }
    return `rgb(${rgb.join(",")})`;
  };

  const getTags = async (local) => {
    setLoading(true);
    if (local && !localStorage.tags) {
      let { data } = await axios.get(
        "https://random-word-api.herokuapp.com/word?number=100000"
      );
      localStorage.setItem("tags", JSON.stringify(data));
    }
    tagsPage(currentPage, local);
    setLoading(false);
    return console.log("DB activa");
  };

  const tagsPage = async (page, local) => {
    // ------ Local Storage version -------
    if (local || api) {
      let db = JSON.parse(localStorage.getItem("tags"));
      setPageOptions({
        ...pageOptions,
        pages: db.length / pageOptions.limit,
      });
      return setTags(
        db.slice(page * pageOptions.limit, (page + 1) * pageOptions.limit)
      );
    }
    //- ------------------- -

    const { data } = await axios.get(
      `http://localhost:3001/?page=${page}&limit=${pageOptions.limit}`
    );
    console.log("etiquetas db", data);
    setPageOptions({
      ...pageOptions,
      pages: Math.ceil(data.counter / pageOptions.limit),
    });
    setTags(data.tags);
  };

  const handlePageClick = (e) => {
    setCurrentPage(e.selected);
    tagsPage(e.selected);
  };

  const handleUpdate = async (id, index) => {
    if (!edit) {
      setInput({ ...input, id: id || index });
      return setEdit(!edit);
    }
    if (!input.edit) {
      return setEdit(false);
    }
    // ---- Local Storage vesion -----
    if (api) {
      let db = JSON.parse(localStorage.getItem("tags"));
      db.splice(currentPage * pageOptions.limit + index, 1, input.edit);
      localStorage.setItem("tags", JSON.stringify(db));
    }
    // -------------------------------
    else {
      await axios.put(`/update/${id}`, { name: input.edit });
    }
    socket.emit("refresh");
    tagsPage(currentPage);
    setEdit(!edit);
    setInput({
      add: "",
      edit: "",
    });
  };

  const handleDelete = async (id, index) => {
    if (api) {
      let db = JSON.parse(localStorage.getItem("tags"));
      db.splice(currentPage * pageOptions.limit + index, 1);
      await localStorage.setItem("tags", JSON.stringify(db));
    } else {
      await axios.delete(`http://localhost:3001/delete/${id}`);
    }
    socket.emit("refresh");
    tagsPage(currentPage);
  };

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const switchAPItags = () => {
    if (api) {
      setCurrentPage(0)
      return setApi(false);
      //return getTags()
    }
    setApi(true);
    getTags(true);
  };

  const addTag = async () => {
    if (api) {
      let db = JSON.parse(localStorage.getItem("tags"));
      db.unshift(input.add);
      localStorage.setItem("tags", JSON.stringify(db));
    } else {
      let body = {
        name: input.add,
        color: randomColor(),
      };
      await axios.post("http://localhost:3001/create", body);
    }
    setInput({
      add: "",
      edit: "",
    });
    socket.emit("refresh");
    tagsPage(currentPage);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ color: randomColor() }}>TaGallery!</h1>
        <div class="switch">
          <label style={{ fontFamily: "monospace" }}>
            API Tags
            <input type="checkbox" onChange={switchAPItags} />
            <span class="lever"></span>
          </label>
        </div>
        <div className="container">
          <div className="col s7">
            <div className="card">
              <div className="card-content col">
                <div className="card-header col s12 row">
                  <input
                    className="col s11"
                    name="add"
                    type="text"
                    placeholder="Agregar etiqueta"
                    value={input.add}
                    onChange={handleChange}
                  />
                  <button
                    className="waves-effect btn-floating"
                    onClick={addTag}
                    disabled={input.add ? false : true}
                  >
                    <i className="material-icons">add</i>
                  </button>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "300px", overflow: "auto" }}
                >
                  {loading && (
                    <div class="progress">
                      <div class="indeterminate"></div>
                    </div>
                  )}
                  <table>
                    <tbody>
                      {tags[0] &&
                        tags.map((tag, index) => (
                          <tr
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <td>
                              <label
                                style={{ color: tag.color || randomColor() }}
                              >
                                <i className="material-icons tiny">lens</i>
                              </label>
                            </td>
                            <td style={{ color: "darkgray" }}>
                              {edit &&
                              (input.id === tag._id || input.id === index) ? (
                                <input
                                  type="text"
                                  name="edit"
                                  placeholder={tag.name || tag}
                                  onChange={handleChange}
                                />
                              ) : (
                                tag.name || tag
                              )}
                            </td>
                            <td className="actions">
                              <button
                                className="waves-effect btn waves-light"
                                type="button"
                                onClick={() => handleUpdate(tag._id, index)}
                              >
                                <i className="material-icons tiny">
                                  {edit &&
                                  (input.id === tag._id || input.id === index)
                                    ? input.edit
                                      ? "save"
                                      : "close"
                                    : "edit"}
                                </i>
                              </button>
                              <button
                                className="waves-effect btn waves-light"
                                onClick={() => handleDelete(tag._id, index)}
                              >
                                <i className="material-icons tiny">delete</i>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {tags[0] && pageOptions.pages > 1 && (
                  <ReactPaginate
                    previousLabel={
                      <i className="material-icons">chevron_left</i>
                    }
                    nextLabel={<i className="material-icons">chevron_right</i>}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageOptions.pages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
