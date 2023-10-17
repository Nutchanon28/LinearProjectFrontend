import "./App.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    // Crop,
    // PixelCrop,
    // convertToPixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 70,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

function App() {
    const [mode, setMode] = useState("canny");
    const [imagePath, setImagePath] = useState("");
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const blobUrlRef = useRef("");
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);

    useEffect(() => {
        console.log(completedCrop);
    }, [completedCrop]);

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    1,
                    0
                );
            }
        },
        100,
        [completedCrop, 1, 0]
    );

    const handleImageChange = (e) => {
        console.log("img onChange triggered");
        const file = e.target.files?.[0];
        console.log(file);

        if (file) {
            const reader = new FileReader();
            setImage(file);

            reader.onload = () => {
                setImagePath(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 1));
    }

    async function handleCrop() {
        const image = imgRef.current;
        const previewCanvas = previewCanvasRef.current;
        if (!image || !previewCanvas || !completedCrop) {
            throw new Error("Crop canvas does not exist");
        }

        // This will size relative to the uploaded image
        // size. If you want to size according to what they
        // are looking at on screen, remove scaleX + scaleY
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const offscreen = new OffscreenCanvas(
            completedCrop.width * scaleX,
            completedCrop.height * scaleY
        );
        const ctx = offscreen.getContext("2d");
        if (!ctx) {
            throw new Error("No 2d context");
        }

        ctx.drawImage(
            previewCanvas,
            0,
            0,
            previewCanvas.width,
            previewCanvas.height,
            0,
            0,
            offscreen.width,
            offscreen.height
        );
        // You might want { type: "image/jpeg", quality: <0 to 1> } to
        // reduce image size
        const blob = await offscreen.convertToBlob({
            type: "image/png",
        });

        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
        }
        blobUrlRef.current = URL.createObjectURL(blob);
        console.log(blob);
        console.log(URL.createObjectURL(blob));
        return blob;
    }

    const handleSubmit = async (e) => {
        console.log(mode);
        e.preventDefault();
        const formData = new FormData();
        const crop = await handleCrop();
        const file = new File([crop], "file_name.jpeg", { type: crop.type });

        console.log(file);
        formData.append("mode", mode);
        formData.append("image", file);
        formData.append("pos", `${completedCrop.x},${completedCrop.y}`);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            console.log(response);
            window.location.href = "http://127.0.0.1:8000/pic";
        } catch (error) {
            console.log(error);
            // alert("ลบเธอออกไปแล้วแต่น้องยิมยังอยู่กับคุณเสมอ")
            // window.location.href =
            //     "https://i.pinimg.com/originals/59/54/b4/5954b408c66525ad932faa693a647e3f.jpg";
        }
    };

    return (
        <div className="home">
            <h2 className="font-Montserrat font-semibold text-center text-neutral-800 text-3xl my-10">
                "Can't delete you from my mind, so I delete you from my pic."
            </h2>
            <div className="appFormContainer">
                <form className="appForm" onSubmit={handleSubmit}>
                    <div className="appFormImgContainer">
                        {image ? (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) =>
                                    setCrop(percentCrop)
                                }
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={undefined}
                                minHeight={100}
                            >
                                <img
                                    ref={imgRef}
                                    src={imagePath}
                                    alt="preview photo"
                                    className="appImage"
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        ) : (
                            <img src="/uploadImage.png" alt="upload-image" />
                        )}
                    </div>
                    {!!completedCrop && (
                        <>
                            <div>
                                <canvas
                                    ref={previewCanvasRef}
                                    style={{
                                        border: "1px solid black",
                                        objectFit: "contain",
                                        width: completedCrop.width,
                                        height: completedCrop.height,
                                        display: "none",
                                    }}
                                />
                            </div>
                        </>
                    )}
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
                                <option
                                    value="canny"
                                    className="detection-option"
                                >
                                    canny
                                </option>
                                <option value="laprician">laprician</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="font-Montserrat cursor-pointer my-5 border-none outline-none bg-[#bb3937] px-5 py-3 text-base text-white border rounded-xl transition-[all ease 0.1s] shadow-[0px 5px 0px 0px #702323;]"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default App;
