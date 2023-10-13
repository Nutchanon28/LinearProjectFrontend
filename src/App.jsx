import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
    const [mode, setMode] = useState("canny");
    const [imagePath, setImagePath] = useState("");
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        console.log("img onChange triggered");
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            setImage(file);

            reader.onload = () => {
                setImagePath(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        console.log(mode);
        e.preventDefault();
        const formData = new FormData();
        formData.append("mode", mode);
        formData.append("image", image);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
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
                        <img src={imagePath} alt="preview photo" />
                    </div>
                    <input
                        required
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="edgeDetectOptions">
                        Edge Detection Options:
                    </label>
                    <select
                        required
                        id="edgeDetectOptions"
                        name="edgeDetect"
                        onChange={(e) => setMode(e.target.value)}
                        defaultValue={"canny"}
                    >
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
