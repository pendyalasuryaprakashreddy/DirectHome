// Simplified AI services for MVP
// These are mock implementations that can be replaced with real ML models later

/**
 * Calculate fraud risk score for a property listing
 * Mock algorithm based on various factors
 */
const calculateFraudRiskScore = (property, user) => {
  let riskScore = 0;

  // Price anomaly detection
  const avgPricePerSqft = {
    'Mumbai': 15000,
    'Delhi': 12000,
    'Bangalore': 8000,
    'Pune': 6000,
    'Gurgaon': 10000
  };

  const cityAvg = avgPricePerSqft[property.city] || 8000;
  const estimatedPrice = cityAvg * property.bhk * 1000; // Rough estimate
  const priceDeviation = Math.abs(property.price - estimatedPrice) / estimatedPrice;

  if (priceDeviation > 0.5) {
    riskScore += 30; // Suspiciously high/low price
  } else if (priceDeviation > 0.3) {
    riskScore += 15;
  }

  // User trust score
  if (user.trust_score < 50) {
    riskScore += 25;
  } else if (user.trust_score < 70) {
    riskScore += 10;
  }

  // Verification status
  if (!user.verified) {
    riskScore += 20;
  }

  // New user (less than 30 days)
  const daysSinceJoin = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceJoin < 30) {
    riskScore += 15;
  }

  // Missing location data
  if (!property.lat || !property.lng) {
    riskScore += 10;
  }

  // Status check
  if (property.status === 'pending_review') {
    riskScore += 5;
  }

  return Math.min(100, Math.max(0, riskScore));
};

/**
 * Recommend price for a property
 * Mock algorithm based on location, BHK, and amenities
 */
const recommendPrice = (property) => {
  const basePrices = {
    'Mumbai': { 1: 5000000, 2: 8000000, 3: 12000000, 4: 18000000, 5: 25000000 },
    'Delhi': { 1: 4000000, 2: 6500000, 3: 10000000, 4: 15000000, 5: 22000000 },
    'Bangalore': { 1: 3500000, 2: 5500000, 3: 8500000, 4: 12000000, 5: 18000000 },
    'Pune': { 1: 2500000, 2: 4000000, 3: 6000000, 4: 9000000, 5: 13000000 },
    'Gurgaon': { 1: 3000000, 2: 5000000, 3: 7500000, 4: 11000000, 5: 16000000 }
  };

  const cityPrices = basePrices[property.city] || basePrices['Bangalore'];
  let basePrice = cityPrices[property.bhk] || cityPrices[3];

  // Amenity multipliers
  const premiumAmenities = ['gym', 'swimming_pool', 'clubhouse', 'concierge'];
  const amenityCount = property.amenities.filter(a => premiumAmenities.includes(a)).length;
  basePrice *= (1 + amenityCount * 0.1);

  // Add some variance
  const variance = basePrice * 0.2;
  const minPrice = basePrice - variance;
  const maxPrice = basePrice + variance;

  return {
    recommended: Math.round(basePrice),
    min: Math.round(minPrice),
    max: Math.round(maxPrice)
  };
};

/**
 * Detect spam in messages
 * Simple keyword-based detection
 */
const detectSpam = (content) => {
  const spamKeywords = [
    'click here', 'buy now', 'limited offer', 'act now', 'urgent',
    'guaranteed', 'free money', 'winner', 'prize', 'lottery'
  ];

  const lowerContent = content.toLowerCase();
  let spamScore = 0;

  spamKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      spamScore += 15;
    }
  });

  // Check for excessive links
  const linkCount = (content.match(/http/gi) || []).length;
  if (linkCount > 2) {
    spamScore += 20;
  }

  // Check for excessive caps
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.5 && content.length > 20) {
    spamScore += 10;
  }

  return Math.min(100, spamScore);
};

/**
 * Simple duplicate image detection using file hash
 * In production, use perceptual hashing
 */
const detectDuplicateImage = async (fileHash, propertyId) => {
  // Mock implementation - in production, compare with existing image hashes
  // For now, return false (no duplicates found)
  return { isDuplicate: false, similarity: 0 };
};

module.exports = {
  calculateFraudRiskScore,
  recommendPrice,
  detectSpam,
  detectDuplicateImage
};
