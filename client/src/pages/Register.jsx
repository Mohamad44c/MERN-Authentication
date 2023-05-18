import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const registerUser = async (e) => {
    e.preventDefault();
    const { name, username, password } = data;
    try {
      const { data } = await axios.post("/register", {
        name,
        username,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success("Login successful. Welcome!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {/* Note: Add regex or some kind of verification for input values */}
      <form onSubmit={registerUser}>
        <input
          type="text"
          placeholder="Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Username"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
