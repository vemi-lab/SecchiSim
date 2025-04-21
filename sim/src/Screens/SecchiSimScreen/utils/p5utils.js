// Constants for the simulation
export const CONSTANTS = {
  MIN_DEPTH: 0,
  MAX_DEPTH: 7, // 10 meters max depth
  DISK_DIAMETER: 650, // Increased from 200 to 300 for larger disk
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
  // Force disk disappearance at depth 5.30 if turbidity is high enough.
  const turbidityThreshold = 1.7 / 5.30; // ~0.32075
  if(depth >= 5.30 && turbidity >= turbidityThreshold) {
    return 0;
  }
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
  p.translate(x/2.6 + horizontalOffset, y - 130 + verticalOffset);
  
  // Draw measuring tape first
  p.push();
  // Added rotation to fix tape angle
  const tapeAngle = p.radians(5); // adjust angle as needed
  p.rotate(tapeAngle);
  
  // Create gradient measuring tape with larger dimensions
  const tapeStart = -x * 1.2; // Extended tape start position
  const tapeEnd = -x * 0.001; // Moved tape end closer to disk
  const tapeWidth = size * 0.5; // Base tape width
  
  // New: Compute a taper factor so the tape's end gets smaller as the disk gets smaller.
  // Assuming deep disks yield a smaller 'size' (min ~20) and shallow disks larger (up to CONSTANTS.DISK_DIAMETER)
  const endTaper = p.map(size, CONSTANTS.DISK_DIAMETER, 10, 1, 0.3);
  
  // Draw tape rectangle with tapered end width
  p.noStroke();
  p.beginShape();
  p.vertex(tapeStart, -tapeWidth);
  p.vertex(tapeEnd, -tapeWidth * endTaper / 2);
  p.vertex(tapeEnd, tapeWidth * endTaper / 40);
  p.vertex(tapeStart, tapeWidth);
  p.endShape(p.CLOSE);
  p.pop();

  // Draw the larger disk
  p.noStroke();
  
  // Draw the four quadrants

    // Bottom-right quadrant (black)
  p.fill(255, opacity);
  p.arc(0, 0, size*1.5, size*1.5, 0, p.HALF_PI);
  
  // Top-right quadrant (white)
  p.fill(0, opacity);
  p.arc(0, 0, size*1.5, size*1.5, -p.HALF_PI, 0);
  
  // Bottom-left quadrant (white)
  p.fill(0, opacity);
  p.arc(0, 0, size*1.5, size*1.5, p.HALF_PI, p.PI);
  
  // Top-left quadrant (black)
  p.fill(255, opacity);
  p.arc(0, 0, size*1.5, size*1.5, p.PI, -p.HALF_PI);
  
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

