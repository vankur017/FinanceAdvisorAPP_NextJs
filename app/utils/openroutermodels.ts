const openroutermodels = [
        "xiaomi/mimo-v2-flash:free", 
        "mistralai/devstral-2512:free",
        "tngtech/deepseek-r1t2-chimera:free",
        "nex-agi/deepseek-v3.1-nex-n1:free",
        "nvidia/nemotron-nano-12b-v2-vl:free",
        "allenai/olmo-3.1-32b-think:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "mistralai/mistral-7b-instruct:free",
        "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        "openai/gpt-oss-120b:free",
        "google/gemma-3n-e4b-it:free"
    ]

export function modelSelection(){
    const selectedModel = openroutermodels[Math.floor(Math.random()*openroutermodels.length)];
    console.log("Model selected is :",selectedModel);
    
    return selectedModel
}
