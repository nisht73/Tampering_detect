import { useState } from "react";
import { testAI } from "./services/api";

function App() {

    const [result, setResult] = useState(null);

    const handleTestAI = async () => {
        try {
            const data = await testAI();

            console.log(data);
            setResult(data);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>AI Document Screening System</h1>

            <button onClick={handleTestAI}>
                Test AI Service
            </button>

            {result && (
                <pre>
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
}

export default App;