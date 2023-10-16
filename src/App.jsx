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
        console.log(image)
        formData.append("mode", mode);
        formData.append("image", image);

        try {

            const response = await axios.post("http://127.0.0.1:8000/",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            console.log(response);
            window.location.href = 'http://127.0.0.1:8000/pic';
        } catch (error) {
            console.log(error);
            // alert("ลบเธอออกไปแล้วแต่น้องยิมยังอยู่กับคุณเสมอ")
            window.location.href = 'https://i.pinimg.com/originals/59/54/b4/5954b408c66525ad932faa693a647e3f.jpg';
        }
    };

    const handlePig = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/pic",
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        return response
    }

    return (
        <div className="home">
            <h2 className="font-Montserrat font-semibold text-center text-neutral-800 text-3xl my-10">"Can't delete you from my mind, so I delete you from my pic."</h2>
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
                    </div>
                    <input
                            type="file"
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4 file:rounded-md
                                file:border-0 file:text-sm file:font-Montserrat
                                file:bg-neutral-200 file:text-neutral-500	
                                hover:file:bg-neutral-50"
                                onChange={(e) => handleImageChange(e)}
                        />
                    <div className="selectionZone">
                        <div className="font-Montserrat font-medium text-center text-neutral-50 text-3xl my-7">
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
                                <option value="canny" className="detection-option">canny</option>
                                <option value="laprician">laprician</option>
                            </select>
                        </div>
                            <button type="submit" className="font-Montserrat cursor-pointer my-5 border-none outline-none bg-[#bb3937] px-5 py-3 text-base text-white border rounded-xl transition-[all ease 0.1s] shadow-[0px 5px 0px 0px #702323;]">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default App;