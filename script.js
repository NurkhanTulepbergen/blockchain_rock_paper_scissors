// Replace with your smart contract address and ABI
const contractAddress = "0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3";
const abi = [
	{
		inputs: [
			{
				internalType: "string",
				name: "_userChoice",
				type: "string"
			}
		],
		name: "play",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "gameHistory",
		outputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				internalType: "enum RockPaperScissors.Choice",
				name: "userChoice",
				type: "uint8"
			},
			{
				internalType: "enum RockPaperScissors.Choice",
				name: "computerChoice",
				type: "uint8"
			},
			{
				internalType: "string",
				name: "result",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getGameHistory",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "user",
						type: "address"
					},
					{
						internalType: "enum RockPaperScissors.Choice",
						name: "userChoice",
						type: "uint8"
					},
					{
						internalType: "enum RockPaperScissors.Choice",
						name: "computerChoice",
						type: "uint8"
					},
					{
						internalType: "string",
						name: "result",
						type: "string"
					}
				],
				internalType: "struct RockPaperScissors.Game[]",
				name: "",
				type: "tuple[]"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
let contract;

// Connect to the user's wallet and initialize the contract
provider.send("eth_requestAccounts", []).then(() => {
  provider.listAccounts().then((accounts) => {
    signer = provider.getSigner(accounts[0]);
    contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("Connected to contract:", contract);
    updateHistory();
  });
});

// Function to play the game
async function play() {
  const choice = document.getElementById("choice").value;
  try {
    await contract.play(choice);
    document.getElementById("gameResult").innerText = "Move submitted! Fetching results...";
    updateHistory();
  } catch (error) {
    console.error("Error playing game:", error);
    document.getElementById("gameResult").innerText = "Error occurred. Try again.";
  }
}

// Function to fetch and display game history
async function updateHistory() {
  try {
    const games = await contract.getGameHistory();
    const historyTable = document.getElementById("history");
    historyTable.innerHTML = ""; // Clear existing history

    games.forEach((game) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${game.user}</td>
        <td>${game.userChoice}</td>
        <td>${game.computerChoice}</td>
        <td>${game.result}</td>
      `;
      historyTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching game history:", error);
  }
}
