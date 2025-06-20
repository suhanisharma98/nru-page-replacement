function simulateNRU() {
  let frameCount = parseInt(document.getElementById("frames").value);
  let refString = document.getElementById("refs").value.trim().split(" ").map(Number);

  let frames = [];
  let referenceBits = {};
  let modifiedBits = {};
  let pageFaults = 0;
  let output = "";

  function resetBits() {
    for (let page of frames) {
      referenceBits[page] = 0;
    }
  }

  for (let i = 0; i < refString.length; i++) {
    let page = refString[i];

    if (!(page in modifiedBits)) {
      modifiedBits[page] = Math.round(Math.random());
    }

    if (frames.includes(page)) {
      referenceBits[page] = 1;
      output += `✅ Page ${page} - Hit\n`;
    } else {
      pageFaults++;
      if (frames.length < frameCount) {
        frames.push(page);
      } else {
        let classes = [[], [], [], []];
        for (let f of frames) {
          let r = referenceBits[f] || 0;
          let m = modifiedBits[f] || 0;
          let classIndex = 2 * r + m;
          classes[classIndex].push(f);
        }

        let victim = classes.find(cls => cls.length > 0)[0];
        frames[frames.indexOf(victim)] = page;
      }

      referenceBits[page] = 1;
      output += `❌ Page ${page} - Fault | Frames: [${frames.join(", ")}]\n`;
    }

    if ((i + 1) % 4 === 0) resetBits();
  }

  document.getElementById("result").innerHTML =
    `📌 Total Page Faults: ${pageFaults}\n\n${output}`;
}
