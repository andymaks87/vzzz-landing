import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
    steps: string[];
    currentStep: number;
    onStepClick?: (step: number) => void;
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
    return (
        <div className="w-full px-4 md:px-0">
            <div className="relative flex justify-between items-center">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0" />

                {/* Active Line (Progress) */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-[#1A9BAA] -translate-y-1/2 rounded-full z-0 transition-all duration-500 ease-in-out"
                    style={{
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
                    }}
                />

                {steps.map((step, index) => {
                    const stepNum = index + 1;
                    const isCompleted = currentStep > stepNum;
                    const isActive = currentStep === stepNum;
                    const isFutute = currentStep < stepNum;

                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center">
                            <button
                                disabled={!isCompleted && !isActive} // Only allow clicking past or current steps
                                onClick={() => onStepClick && isCompleted && onStepClick(stepNum)}
                                className={`
                                    w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300
                                    ${isActive
                                        ? 'bg-[#1A9BAA] border-white ring-4 ring-[#1A9BAA]/20 scale-110 shadow-lg shadow-[#1A9BAA]/30'
                                        : isCompleted
                                            ? 'bg-[#1A9BAA] border-[#1A9BAA] text-white hover:bg-[#158896]'
                                            : 'bg-white border-gray-200 text-gray-400'
                                    }
                                `}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                ) : (
                                    <span className={`text-sm md:text-base font-bold ${isActive ? 'text-white' : ''}`}>
                                        {stepNum}
                                    </span>
                                )}
                            </button>
                            <span className={`
                                absolute top-14 text-xs md:text-sm font-semibold whitespace-nowrap transition-colors duration-300
                                ${isActive ? 'text-[#1A9BAA]' : isCompleted ? 'text-[#0B2A3D]' : 'text-gray-400'}
                            `}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
