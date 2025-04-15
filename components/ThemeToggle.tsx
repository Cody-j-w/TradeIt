import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Slider } from '@/components/ui/slider'; // Assuming you have a Slider component
import { cn } from '@/lib/utils'; //Utility for combining class names

const DarkModeToggle = () => {
  const { setTheme, theme } = useTheme();
  const [sliderValue, setSliderValue] = useState(theme === 'dark' ? [100] : [0]);

    // Update slider value when theme changes
    useEffect(() => {
        setSliderValue(theme === 'dark' ? [100] : [0]);
    }, [theme]);


  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const newValue = value[0];
    setTheme(newValue > 50 ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
      <Slider
        value={sliderValue}
        onValueChange={handleSliderChange}
        max={100}
        step={100}
        className={cn(
          "w-16", // Make the slider smaller
          "data-[orientation=horizontal]:h-6 data-[orientation=horizontal]:w-24", // Explicit size
          "data-[orientation=horizontal]:px-0",  // Remove horizontal padding
          "[&_[role=slider]]:h-4 [&_[role=slider]]:w-4", // Slider thumb size
          "[&_[role=slider]]:translate-y-[-2px]", // Adjust vertical position.
          "[&_[role=slider]]:focus:outline-none", // Remove default focus outline
          "[&_[role=slider]]:focus-visible:ring-2",
          "[&_[role=slider]]:focus-visible:ring-ring",
          "[&_[role=slider]]:focus-visible:ring-offset-2",
          "dark:[&_[role=slider]]:focus-visible:ring-offset-gray-900", // Corrected
          "aria-label:Theme Slider" // Add aria label
        )}
        aria-label="Theme"
      />

      <Moon className="h-[1.2rem] w-[1.2rem] text-gray-500" />
    </div>
  );
};

export default DarkModeToggle;
