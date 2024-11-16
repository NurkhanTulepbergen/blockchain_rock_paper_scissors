const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address
const abi = [
    // Add your contract's ABI here
];

let provider, signer, contract;

window.onload = async () => {
    if (typeof window.ethereum !== "undefined") {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);

        // Load data
        loadGameHistory();
        loadPlayers();
    } else {
        alert("MetaMask is required!");
    }
};

async function playGame(choice) {
    try {
        const tx = await contract.play(choice);
        await tx.wait();
        alert("Game played successfully!");

        // Refresh data
        loadGameHistory();
    } catch (error) {
        console.error(error);
        alert("An error occurred.");
    }
}

async function loadGameHistory() {
    const history = await contract.getUserGameHistory(await signer.getAddress());
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = "<li>No games played yet.</li>";
    } else {
        history.forEach((game, index) => {
            const li = document.createElement("li");
            li.innerText = `Game ${index + 1}: ${game.result} (You: ${game.userChoice}, Computer: ${game.computerChoice})`;
            historyList.appendChild(li);
        });
    }
}

async function loadPlayers() {
    const players = await contract.getAllPlayers();
    const playersList = document.getElementById("players-list");
    playersList.innerHTML = "";

    if (players.length === 0) {
        playersList.innerHTML = "<li>No players yet.</li>";
    } else {
        players.forEach(player => {
            const li = document.createElement("li");
            li.innerText = player;
            playersList.appendChild(li);
        });
    }
}
