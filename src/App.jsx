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
        console.log(file)

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
            alert("ลบเธอออกไปแล้วแต่น้องยิมยังอยู่กับคุณเสมอ")
        } catch (error) {
            console.log(error);
            alert("ลบเธอออกไปแล้วแต่น้องยิมยังอยู่กับคุณเสมอ")
        }
    };

    return (
        <div className="home">
            {/* <h1>Linear Project</h1> */}
            <h2 className="header">"Can't delete you from my mind, so I delete you from my pic."</h2>
            <div className="appFormContainer">
                <form className="appForm" onSubmit={handleSubmit}>
                    <div className="appFormImgContainer">
                        {
                            image ?  (
                                <img src={imagePath} alt="preview photo" className="appImage" />
                            ) : (
                                <img src="/uploadImage.png" alt="upload-image" />
                            )
                        }
                        {/* <img src={imagePath} alt="preview photo" className="appImage" /> */}
                    </div>
                    <input
                        required
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <div className="selectionZone">
                        <div className="subHeader">
                            <label htmlFor="edgeDetectOptions">
                                Edge Detection Options:
                            </label>
                        </div>
                        <div className="dropdown">
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
                        </div>
                    <button type="submit" className="submitButton">submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default App;
