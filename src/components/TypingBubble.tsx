import { createSignal, onMount } from 'solid-js';

const images = [
  ('https://i.postimg.cc/7hNK3X8L/robot.webp'),
  ('https://i.postimg.cc/TYwVNTn0/search.gif'),
];

export const TypingBubble = () => {
  const [imgSrc, setImgSrc] = createSignal(images[0]);

  onMount(() => {
    // Pick a random image on mount
    const idx = Math.floor(Math.random() * images.length);
    setImgSrc(images[idx]);
  });

  return (
    <div class="flex items-center justify-center">
      <img
        src={imgSrc()}
        alt="Bot is thinking"
        width={40}
        height={40}
        class="h-20 w-20"
      />
    </div>
  );
};