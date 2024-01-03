import { SketchLogo } from "@phosphor-icons/react";

export const getRankInfo = (totalPoints) => {
  if (totalPoints >= 200) {
    return {
      backgroundColor: "#d381e5",
      rankName: "Diamond",
      color: "white",
      icon: <SketchLogo size={25} color="#d381e5" weight="fill" />,
    };
  } else if (totalPoints >= 150) {
    return {
      backgroundColor: "#3ba7b4",
      rankName: "Platinum",
      color: "white",
      icon: <SketchLogo size={25} color="#3ba7b4" weight="fill" />,
    };
  } else if (totalPoints >= 100) {
    return {
      backgroundColor: "#ffd700",
      rankName: "Gold",
      color: "black",
      icon: <SketchLogo size={25} color="#ffd700" weight="fill" />,
    };
  } else if (totalPoints >= 50) {
    return {
      backgroundColor: "#c0c0c0",
      rankName: "Silver",
      color: "black",
      icon: <SketchLogo size={25} color="RGB(192, 192, 192) " weight="fill" />,
    };
  } else {
    return {
      backgroundColor: "#cd7f32",
      rankName: "Bronze",
      color: "white",
      icon: <SketchLogo size={25} color="RGB(205, 127, 50)" weight="fill" />,
    };
  }
};
