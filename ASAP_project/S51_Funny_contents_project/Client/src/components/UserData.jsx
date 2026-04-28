import { useEffect, useState } from 'react';
import axios from 'axios';

const UserData = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://s51-funny-contents-project-3.onrender.com/GET");
        setUser(response.data);
        console.log("Fetched data:", response.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("User state:", user);

  return (
    <div className='user_container'>
      {user.map((data) => (
        <div key={data.id} className='user'>
          <h3>Name : {data.fname} {data.lname}</h3>
          <h3>Country : {data.country}</h3>
          <h3>content : {data.typeofcontent}</h3>
          <h4>content</h4>
        </div>
      ))}
    </div>
  );
};

export default UserData;