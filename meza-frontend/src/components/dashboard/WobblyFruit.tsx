import { FRUIT_SEQUENCE } from "../onboarding/FruitCharacter";

export default function WobblyFruit({ className = "" }: { className?: string }) {
  const Fruit = FRUIT_SEQUENCE[new Date().getDay() % FRUIT_SEQUENCE.length];
  return (
    <div aria-hidden="true" className={`origin-bottom animate-wobble ${className}`}>
      <Fruit />
    </div>
  );
}