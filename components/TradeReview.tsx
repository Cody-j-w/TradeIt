import React, { useState } from 'react';
import Image from 'next/image';

interface TradeReviewProps {
  isOpen: boolean;
  onClose: () => void;
  tradePartnerAvatar: string; // URL to the trade partner's avatar
}

const TradeReview: React.FC<TradeReviewProps> = ({ isOpen, onClose, tradePartnerAvatar }) => {
  const [rating, setRating] = useState<number>(0);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    // In a real app, you'd send the rating to a server here.
    console.log('Rating submitted:', rating);
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
    >
      <div className="bg-white rounded-lg w-full max-w-md p-6 z-50 flex flex-col items-center dark:bg-trade-gray">
        <h2 className="text-lg font-semibold mb-4">Rate Your Trade Partner</h2>

        {/* Trade Partner Avatar */}
        <Image
          src={tradePartnerAvatar}
          alt="Trade Partner Avatar"
          width={96} // Use explicit dimensions, or adjust as needed
          height={96}
          className="rounded-full mb-4"
        />

        {/* Star Rating System */}
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Image
              key={star}
              src={star <= rating ? '/starfull.svg' : '/staroutline.svg'} // Use your paths here
              alt={`Star ${star}`}
              width={32} // Use explicit dimensions
              height={32}
              className="cursor-pointer"
              onClick={() => handleStarClick(star)}
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded"
          disabled={rating === 0} // Disable if no rating is selected
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TradeReview;
