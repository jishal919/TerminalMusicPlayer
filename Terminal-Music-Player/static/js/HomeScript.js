function random_bg_color() {
    let colors = [
      "#663399",
      "#6A3093",
      "#792F9A",
      "#85318C",
      "#8A2BE2",
      "#9735A8",
      "#9F4F97",
      "#A71AA7",
      "#B74395",
      "#BB22B2"
    ];
  
    let currentIndex = parseInt(localStorage.getItem("colorIndex")) || 0;
    let nextIndex = (currentIndex + 1) % colors.length;
  
    let currentColor = colors[currentIndex];
    let nextColor = colors[nextIndex];
  
    // Apply transition to background color
    document.body.style.transition = 'background-color 2s ease-in-out';
  
    // Gradually change the background color
    document.body.style.backgroundColor = currentColor;
  
    // Save the next index in local storage
    localStorage.setItem("colorIndex", nextIndex.toString());
  
    // Set a CSS variable with the next color value
    document.body.style.setProperty("--new-color", nextColor);
  }
  
  // Call the random_bg_color function initially
  random_bg_color();
  
  // Schedule automatic background color changes at regular intervals
  setInterval(random_bg_color, 2700); // Change color every 2.7 seconds
  