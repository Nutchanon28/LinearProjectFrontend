import "./App.css";

function App() {
    return (
        <div className="home">
            <h1>Linear Project</h1>
            <h2>Cant delete you so my mind, so I delete you from my photos.</h2>
            <div className="appFormContainer">
                <form className="appForm">
                    <img src="preview photo" alt="preview photo" />
                    <input required type="file" accept="image/*" />
                    <label htmlFor="edgeDetectOptions">
                        Edge Detection Options:
                    </label>
                    <select id="edgeDetectOptions" name="edgeDetect">
                        <option value="canny">canny</option>
                        <option value="laprician">laprician</option>
                    </select>
                    <button>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default App;
