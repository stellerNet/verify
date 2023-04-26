const oldHtml = document.documentElement.innerHTML;

// Replace with input styled like Discord
document.documentElement.innerHTML = `
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #2f3136;">
    <input type="text" id="input" style="padding: 10px; border-radius: 5px; border: none; background-color: #40444b; color: #dcddde; font-size: 16px; width: 400px;" placeholder="Type something...">
  </div>
`;

// Wait for user input
const input = document.getElementById("input");
input.addEventListener("keyup", async (event) => {
  if (event.key === "Enter") {
    // Turn input into sha256 hash
    const inputHash = sha2566(input.value);

    // Check if inputHash is in the list from the link
    const response = await fetch("https://raw.githubusercontent.com/stellerNet/verify/main/list.txt");
    const list = await response.json();
    if (list.includes(inputHash)) {
      // Show old HTML
      document.documentElement.innerHTML = oldHtml;

      // Check every 30 seconds if inputHash is still valid
      setInterval(async () => {
        const response = await fetch("https://raw.githubusercontent.com/stellerNet/verify/main/list.txt");
        const newList = await response.json();
        if (!newList.includes(inputHash)) {
          // If inputHash is no longer valid, replace with input again
          document.documentElement.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #2f3136;">
              <input type="text" id="input" style="padding: 10px; border-radius: 5px; border: none; background-color: #40444b; color: #dcddde; font-size: 16px; width: 400px;" placeholder="Type something...">
            </div>
          `;
        }
      }, 30000);
    }
  }
});

// Load sha256 library from CDN
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js";
script.async = true;
script.onload = () => {
  window.sha2566 = sha2566;
};
document.head.appendChild(script);

// Function to compute sha256 hash
function sha2566(message) {
  return sha256(message).toString();
}
