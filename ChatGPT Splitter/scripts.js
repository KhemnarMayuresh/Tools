document.addEventListener("DOMContentLoaded", function () {
    const promptTextarea = document.getElementById("prompt");
    const charLimitSelect = document.getElementById("charLimit");
    const charCountDisplay = document.getElementById("charCount");
    const splitButton = document.getElementById("splitButton");
    const splitPartsDiv = document.getElementById("splitParts");
  
    promptTextarea.addEventListener("input", function () {
      charCountDisplay.textContent = `Characters entered: ${promptTextarea.value.length}`;
    });
  
    splitButton.addEventListener("click", function () {
      const promptText = promptTextarea.value;
      const charLimit = parseInt(charLimitSelect.value);
      const numParts = Math.ceil(promptText.length / charLimit);
      splitPartsDiv.innerHTML = "";
      const partText = `The content I need to send you is too large to send all at once. To manage this, I'll be sending it in parts. Here's how it will work:<br> 
  1. I'll send you each part labeled like this:<br> 
  [START PART 1/10]<br> 
  Content of part 1<br> 
  [END PART 1/10]<br> 
  2. After receiving each part, please reply with "Received part 1/10".<br> 
  3. Once all parts are sent, I'll notify you with "ALL PARTS SENT". Then, you can continue processing the data and responding to my requests.<br> `;
  
      //First initial Prompt
      const partDiv = document.createElement("div");
      partDiv.classList.add("text-part");
      partDiv.innerHTML = partText;
      const copyButton = document.createElement("button");
      copyButton.classList.add("copy-button");
      copyButton.textContent = "Copy Initial Prompt";
      copyButton.addEventListener("click", function () {
        navigator.clipboard.writeText(partText);
      });
      partDiv.appendChild(copyButton);
      splitPartsDiv.appendChild(partDiv);
  
      for (let i = 0; i < numParts; i++) {
        const start = i * charLimit;
        const end = start + charLimit;
        let partText = "";
  
        if (i === numParts - 1) {
          partText = `[START PART ${
            i + 1
          }/${numParts}] <br> <pre>${promptText.substring(start, end)}</pre> <br> [END PART ${
            i + 1
          }/${numParts}] <br> ALL PARTS SENT. Now you can do [the task]. <br>`;
        } else {
          partText = `Please hold off on responding for now. This is another part of the text I'll be sending. Once you receive it, please acknowledge with "Part ${
            i + 1
          }/${numParts} received" and await the next part. <br> [START PART ${
            i + 1
          }/${numParts}] <br> <pre>${promptText.substring(start, end)}</pre> <br> [END PART ${
            i + 1
          }/${numParts}] <br> Remember, refrain from responding until you receive all parts. Just confirm receipt of this part with "Part ${
            i + 1
          }/${numParts} received" and await further instructions. <br>`;
        }
        const partDiv = document.createElement("div");
        partDiv.classList.add("text-part");
        partDiv.innerHTML = partText;
        const copyButton = document.createElement("button");
        copyButton.classList.add("copy-button");
        copyButton.textContent = "Copy Prompt " + (i + 1);
        copyButton.addEventListener("click", function () {
          navigator.clipboard.writeText(partText);
        });
        partDiv.appendChild(copyButton);
        splitPartsDiv.appendChild(partDiv);
      }
    });
  });
  