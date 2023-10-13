import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
    const [avatarPath, setAvatarPath] = useState("");

    const handleAvatarChange = (e) => {
        console.log("img onChange triggered");
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                setAvatarPath(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000", {
                test: "test",
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="home">
            <h1>Linear Project</h1>
            <h2>Cant delete you so my mind, so I delete you from my photos.</h2>
            <div className="appFormContainer">
                <form className="appForm" onSubmit={handleSubmit}>
                    <div className="appFormImgContainer">
                        <img src={avatarPath} alt="preview photo" />
                    </div>
                    <input
                        required
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                    <label htmlFor="edgeDetectOptions">
                        Edge Detection Options:
                    </label>
                    <select id="edgeDetectOptions" name="edgeDetect">
                        <option value="canny">canny</option>
                        <option value="laprician">laprician</option>
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default App;
