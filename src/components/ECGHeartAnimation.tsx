import heroHeart from '@/assets/hero-heart.jpg';

export default function ECGHeartAnimation() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl" <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl" style={{ animation: 'heartbeatSlow 0.9s ease-in-out infinite' }}>>
      <img src={heroHeart} alt="Anatomical heart" className="w-full h-full object-cover" />
    </div>
  );
}
