// Constants for the simulation
export const CONSTANTS = {
  MIN_DEPTH: 0,
  MAX_DEPTH: 7, // 10 meters max depth
  DISK_DIAMETER: 300, // Increased from 200 to 300 for larger disk
  DISK_SEGMENTS: 4, // Number of segments in the Secchi disk
  WATER_ATTENUATION: 0.2,  // Light attenuation coefficient in water
  DISK_COLOR: [255, 255, 255],  // White color for Secchi disk
  WATER_COLOR: [0, 105, 148],  // Blue color for water
  NUM_PIXELS: 50,
  EASING: 0.05,
};

let waterImage;
export const preload = (p5) => {
    waterImage = p5.loadImage('/clearLake.png');
};

// Calculate visibility based on depth and turbidity
export const calculateVisibility = (depth, turbidity) => {
  // Visibility decreases with depth and turbidity
  const maxVisibility = 1;
  const visibilityFactor = Math.exp(-turbidity * depth / 2);
  return Math.max(0, Math.min(maxVisibility, visibilityFactor));
};

// Draw water with depth gradient
export const drawWater = (p5, width, height, currentDepth, maxDepth) => {
  for (let y = 0; y < height; y++) {
    const depth = (y / height) * maxDepth;
    const alpha = Math.min(255, depth * 40);
    const waterColor = p5.color(100, 50, 0, alpha);
    p5.stroke(waterColor);
    p5.line(0, y, width, y);
  }
};

// Draw the Secchi disk
export const drawSecchiDisk = (p, x, y, visibility, size = CONSTANTS.DISK_DIAMETER) => {
  p.push();
  
  // Calculate opacity based on visibility
  const opacity = p.map(visibility, 0, 1, 0, 255);
  
  // Add floating motion in both directions
  const time = p.millis() * 0.001;
  const verticalOffset = p.sin(time * 2) * 7;
  const horizontalOffset = p.cos(time * 1.5) * 5;
  
  // Draw disk with floating motion
  p.translate(x + horizontalOffset, y + verticalOffset);
  
  // Draw measuring tape first
  p.push();
  // Create gradient measuring tape with larger dimensions
  const tapeStart = -x * 1.2; // Extended tape start position
  const tapeEnd = -x * 0.1; // Moved tape end closer to disk
  const tapeWidth = size * 0.08; // Increased tape width
  
  // Draw the main tape line with gradient
  p.push();
  const grad = p.drawingContext.createLinearGradient(tapeStart, -25, tapeEnd, y);
  grad.addColorStop(0, p.color(255, 255, 255, opacity));
  grad.addColorStop(1, p.color(255, 255, 255, opacity));
  p.drawingContext.fillStyle = grad;
  
  // Draw tape rectangle
  p.noStroke();
  p.beginShape();
  p.vertex(tapeStart, -tapeWidth);
  p.vertex(tapeEnd, -tapeWidth/2);
  p.vertex(tapeEnd, tapeWidth/2);
  p.vertex(tapeStart, tapeWidth);
  p.endShape(p.CLOSE);
  p.pop();
  
  // // Draw tick marks with larger dimensions
  // for(let i = 1; i <= CONSTANTS.MAX_DEPTH; i++) {
  //   const tickX = p.map(i, 0, CONSTANTS.MAX_DEPTH, tapeEnd, tapeStart);
  //   p.stroke(255, opacity);
  //   p.strokeWeight(3); // Increased stroke weight for tick marks
  //   p.line(tickX, -tapeWidth, tickX, tapeWidth);
    
  //   // Add numbers with larger text
  //   if(y > 0.68) {
  //     p.textSize(size * 0.12); // Increased text size
  //     p.fill(255, opacity);
  //     p.noStroke();
  //     p.textAlign(p.CENTER, p.BOTTOM);
  //     p.text(i, tickX, tapeWidth * 2);
  //   } else {
  //     p.textSize(size * 0.12); // Increased text size
  //     p.fill(255, opacity);
  //     p.noStroke();
  //     p.textAlign(p.CENTER, p.TOP);
  //     p.text(i, tickX, -tapeWidth * 2);
  //   }
  // }
  p.pop();
  
  // Draw the larger disk
  p.noStroke();
  
  // Draw the four quadrants
  // Top-right quadrant (white)
  p.fill(255, opacity);
  p.arc(0, 0, size, size, -p.HALF_PI, 0);
  
  // Bottom-right quadrant (black)
  p.fill(0, opacity);
  p.arc(0, 0, size, size, 0, p.HALF_PI);
  
  // Bottom-left quadrant (white)
  p.fill(255, opacity);
  p.arc(0, 0, size, size, p.HALF_PI, p.PI);
  
  // Top-left quadrant (black)
  p.fill(0, opacity);
  p.arc(0, 0, size, size, p.PI, -p.HALF_PI);
  
  // Add outer ring with thicker stroke
  p.noFill();
  p.stroke(255, opacity);
  p.strokeWeight(4); // Increased stroke weight for disk outline
  p.ellipse(0, 0, size, size);
  
  p.pop();
};

// Calculate the Secchi depth (depth at which disk disappears) based on turbidity
export const calculateSecchiDepth = (turbidity) => {
  // Empirical relationship between turbidity and Secchi depth
  return 1.7 / turbidity;
};

// Draw depth markers
export const drawDepthMarkers = (p5, width, height, currentDepth, maxDepth) => {
  const markerSpacing = height / 10; // Draw markers every meter
  
  p5.stroke(255);
  p5.strokeWeight(1);
  p5.fill(255);
  p5.textAlign(p5.LEFT, p5.CENTER);
  
  for (let y = 0; y <= height; y += markerSpacing) {
      const depth = (y / height) * maxDepth;
      p5.line(0, y, 20, y);
      p5.text(depth.toFixed(1) + 'm', 25, y);
  }
  
  // Draw current depth indicator
  const currentY = p5.map(currentDepth, 0, maxDepth, 0, height);
  p5.stroke(255, 0, 0);
  p5.strokeWeight(2);
  p5.line(0, currentY, 40, currentY);
  p5.fill(255, 0, 0);
  p5.text(currentDepth.toFixed(1) + 'm', 45, currentY);
};

// Handle mouse interaction for depth control
export const handleMouseInteraction = (p5, mouseY, height, maxDepth) => {
  return p5.map(mouseY, 0, height, 0, maxDepth);
};

// Calculate water quality based on Secchi depth
export const calculateWaterQuality = (secchiDepth) => {
  if (secchiDepth > 8) {
      return {
          quality: "Excellent",
          description: "Very clear water with high transparency"
      };
  } else if (secchiDepth > 4) {
      return {
          quality: "Good",
          description: "Clear water with good visibility"
      };
  } else if (secchiDepth > 2) {
      return {
          quality: "Fair",
          description: "Moderately clear water"
      };
  } else {
      return {
          quality: "Poor",
          description: "Turbid water with low visibility"
      };
  }
};

// Format display values
export const formatDisplayValue = (value, unit = '', decimals = 1) => {
  return `${value.toFixed(decimals)}${unit}`;
};

// Helper function to interpolate colors
export const lerpColor = (p5, color1, color2, amount) => {
  const c1 = p5.color(...color1);
  const c2 = p5.color(...color2);
  return p5.lerpColor(c1, c2, amount);
};

