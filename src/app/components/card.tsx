import React, { useState } from 'react'

type CardProps = {
    title?: string | React.ReactNode,
    id?: string,
    extrainfo?: string,
    children?: React.ReactNode,
    variant?: 'default' | 'glass' | 'elevated' | 'bordered',
    size?: 'sm' | 'md' | 'lg',
    isComplete?: boolean,
    isActive?: boolean,
    icon?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
    const [isHovered, setIsHovered] = useState(false);
    
    const {
        title,
        id,
        extrainfo,
        children,
        variant = 'default',
        size = 'md',
        isComplete = false,
        isActive = false,
        icon
    } = props;

    const getCardClasses = () => {
        const baseClasses = "card w-full transition-all duration-300 ease-out group";
        
        const variantClasses = {
            default: "bg-base-100 shadow-lg hover:shadow-xl",
            glass: "bg-base-100/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-base-300/50",
            elevated: "bg-base-100 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1",
            bordered: "bg-base-100 border-2 border-primary/20 hover:border-primary/40 shadow-md hover:shadow-lg"
        };

        const sizeClasses = {
            sm: "card-compact",
            md: "",
            lg: "card-normal"
        };

        const statusClasses = isComplete
            ? "ring-2 ring-success/30 border-success/20"
            : isActive
            ? "ring-2 ring-primary/30 border-primary/20 shadow-primary/10"
            : "";

        const hoverClasses = isHovered ? "scale-[1.02]" : "";

        return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${statusClasses} ${hoverClasses}`;
    };

    const getTitleClasses = () => {
        const baseClasses = "card-title flex items-center gap-3 group-hover:text-primary transition-colors duration-200";
        
        if (isComplete) return `${baseClasses} text-success`;
        if (isActive) return `${baseClasses} text-primary`;
        
        return baseClasses;
    };

    return (
        <div
            ref={ref}
            className={getCardClasses()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="card-body relative">
                {/* Completion indicator */}
                {isComplete && (
                    <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center animate-bounce">
                            <svg className="w-4 h-4 text-success-content" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Active indicator */}
                {isActive && !isComplete && (
                    <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-primary rounded-full animate-ping"></div>
                    </div>
                )}

                {/* Title Section */}
                {title && (
                    <h4 className={getTitleClasses()}>
                        {id && (
                            <span
                                id={id}
                                style={{
                                    display: 'block',
                                    position: 'absolute',
                                    visibility: 'hidden',
                                    marginTop: '-23px',
                                    paddingTop: '23px'
                                }}
                            />
                        )}
                        
                        {/* Icon */}
                        {icon && (
                            <div className={`flex-shrink-0 transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`}>
                                {icon}
                            </div>
                        )}
                        
                        {/* Title Text */}
                        <div className="flex-1">
                            {title}
                        </div>
                    </h4>
                )}
                
                {/* Content */}
                <div className={`${title ? 'mt-4' : ''} transition-all duration-200`}>
                    {children}
                </div>
                
                {/* Extra Info */}
                {extrainfo && (
                    <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                        <div className="text-sm text-base-content/60 italic">
                            {extrainfo}
                        </div>
                    </div>
                )}

                {/* Hover Effect Gradient */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl transition-opacity duration-300 pointer-events-none ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            </div>

            {/* Custom styles for enhanced effects */}
            <style jsx>{`
                .card:hover {
                    transform: translateY(-2px);
                }
                
                .shadow-3xl {
                    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
                }
                
                @media (prefers-reduced-motion: reduce) {
                    .card {
                        transition: none !important;
                        transform: none !important;
                    }
                    
                    .animate-bounce,
                    .animate-ping {
                        animation: none !important;
                    }
                }
            `}</style>
        </div>
    );
});

export default Card