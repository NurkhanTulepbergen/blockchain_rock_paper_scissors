const contractAddress = "0x3e420BE52389D53Fab8F9bEEFb5e6AE5D1e80878"; // Replace with your contract address
const abi = 
[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum RockPaperScissors.Choice",
				"name": "userChoice",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "enum RockPaperScissors.Choice",
				"name": "computerChoice",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "result",
				"type": "string"
			}
		],
		"name": "GamePlayed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userChoice",
				"type": "string"
			}
		],
		"name": "play",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllPlayers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserGameHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "enum RockPaperScissors.Choice",
						"name": "userChoice",
						"type": "uint8"
					},
					{
						"internalType": "enum RockPaperScissors.Choice",
						"name": "computerChoice",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "result",
						"type": "string"
					}
				],
				"internalType": "struct RockPaperScissors.Game[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
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