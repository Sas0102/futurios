"use client";

// =====================================================
// STACKED OPTIONS WIDGET
// A deck of option pills where the "active" one sits
// solid up front, and the rest fan out behind it, faded
// and slightly offset — like a card stack.
// =====================================================

type StackedOption = {
  label: string;
  active?: boolean;
};

export default function StackedOptionsWidget({
  options,
}: {
  options: StackedOption[];
}) {
  const activeIndex = options.findIndex((o) => o.active);
  const centerIndex = activeIndex === -1 ? Math.floor(options.length / 2) : activeIndex;

  return (
    <div className="relative flex flex-col items-center py-2">
      {options.map((option, i) => {
        const distance = i - centerIndex;
        const isActive = i === centerIndex;

        return (
          <div
            key={option.label}
            style={{
              // fan each card out from the active one
              transform: `translateY(${distance * -6}px) scale(${
                1 - Math.abs(distance) * 0.04
              })`,
              zIndex: options.length - Math.abs(distance),
              opacity: isActive ? 1 : Math.max(0.25, 1 - Math.abs(distance) * 0.3),
            }}
            className={`
              w-full
              -mb-2
              last:mb-0
              rounded-2xl
              px-6
              py-4
              text-center
              text-sm
              font-medium
              transition-all
              duration-300
              ${
                isActive
                  ? "bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                  : "bg-white/10 text-white/70 backdrop-blur-sm"
              }
            `}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
}