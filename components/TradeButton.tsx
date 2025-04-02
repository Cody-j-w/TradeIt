// TradeButton.tsx
'use client'

import Image from "next/image";
import trading from "@/assets/trading.png";

interface TradeButtonProps {
  onOpen: () => void;
}

const TradeButton: React.FC<TradeButtonProps> = ({ onOpen }) => {
  const buttonStyle = {
    position: 'fixed' as 'fixed',
    bottom: '100px', // Adjust this value based on the NavBar's height + spacing
    right: '20px',
    zIndex: 1000,
    display: 'flex', // Use flexbox for centering
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
  };

  return (
    <button
      onClick={onOpen}
      className="bg-trade-orange text-trade-white p-3 rounded-full shadow-lg"
      style={buttonStyle}
    >
      <Image src={trading} alt="Trade" width={24} height={24} />
    </button>
  );
};

export default TradeButton;