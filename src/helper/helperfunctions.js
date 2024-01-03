export const calculateLevelAndProgress = (totalpoints) => {
  const points = totalpoints;
  const base = 3;
  const scalingFactor = 1.5;
  let level = 1;
  let requiredPoints = base * Math.pow(level, scalingFactor);

  while (points >= requiredPoints) {
    level++;
    requiredPoints = base * Math.pow(level, scalingFactor);
  }

  const levelStartPoints = base * Math.pow(level - 1, scalingFactor);
  const levelProgress = Math.max(0, points - levelStartPoints);
  const totalPointsInLevel = requiredPoints - levelStartPoints;

  return {
    level: level,
    progress: Math.floor(levelProgress),
    totalPointsInLevel: Math.ceil(totalPointsInLevel),
  };
};
