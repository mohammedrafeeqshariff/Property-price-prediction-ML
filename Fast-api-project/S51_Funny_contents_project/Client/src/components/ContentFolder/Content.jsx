import { useEffect, useState } from "react";
import "./Content.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import { CgProfile } from "react-icons/cg";
import { SlArrowUp } from "react-icons/sl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";

const UserData = () => {
  const [user, setUser] = useState([]);
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const userID = Cookies.get("userID");

  const displayFilteredData = filter === "all" ? user : user.filter(ele => ele.user?.username === filter);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://s51-funny-contents-project-3.onrender.com/GET");
      let userData = response.data.map((item) => ({
        ...item,
        liked: false,
      }));
      userData.reverse();

      userData = await Promise.all(userData.map(async (item) => {
        const res = await axios.get(`https://s51-funny-contents-project-3.onrender.com/getUser/${item.userID}`);
        return { ...item, user: res.data };
      }));

      setUser(userData);
      setLoading(false);
      console.log("Fetched data:", userData);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("User state:", user);

  const togglePopup = () => {
    setPopup(!popup);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const handleLikeClick = (contentItem) => {
    setUser((prevUser) =>
      prevUser.map((item) =>
        item === contentItem ? { ...item, liked: !item.liked } : item
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://s51-funny-contents-project-3.onrender.com/DELETE/${id}`);
      toast.success("Meme deleted");
      fetchData();
    } catch (error) {
      console.log(error.message);
      toast.error("Delete Unsuccessful");
    }
  };

  const handleUpdate = () => {
    navigate("/update");
  };

  const uniqueUsernames = [...new Set(user.map(data => data.user?.username))];

  return (
    <div className="user_container">
      <h1>Memes of the day</h1>

      <select name="search by names" id="" onChange={handleFilter} className="filter">
        <option value="all">all</option>
        {uniqueUsernames.map((username, index) => (
          username && <option key={index} value={username}>
            {username}
          </option>
        ))}
      </select>

      <button className="arrow_up" onClick={scrollUp}>
        <SlArrowUp />
      </button>

      {loading ? (
        <h1 className="loading">Loading...</h1>
      ) : (
        displayFilteredData.map((data, ind) => (
          <div key={ind} className="userandcontent">
            <div>
              <h2 onClick={togglePopup} className="username" style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                <CgProfile />{data.user?.username}
              </h2>
              {popup && (
                <div className="popup">
                  <h2>{data.user?.country}</h2>
                  <h2>{data.user?.age}</h2>
                </div>
              )}
            </div>

            <div className="image_container">
              <img className="image" src={data.content} alt="Users content" />
            </div>

            <div className="like_button_delete_update">
              <div onClick={() => handleLikeClick(data)}>
                <i className={`fa${data.liked ? "s" : "r"} fa-heart`} />
              </div>

              {userID === data.userID && (
                <div>
                  <button
                    className="delete"
                    onClick={() => handleDelete(data._id)}
                  >
                    Delete
                  </button>
                  <NavLink to={`/update/${data._id}`}>
                    <button
                      className="update"
                      onClick={() => {
                        handleUpdate(data._id);
                      }}
                    >
                      Update
                    </button>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserData;
