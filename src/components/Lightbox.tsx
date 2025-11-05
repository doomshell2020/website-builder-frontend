import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Play, Pause, Heart, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence, Variants } from "framer-motion";

// 🖼️ 6 Different Image Sets
const allImages1 = [
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/02/new4a-300x225.jpg", alt: "Elegant evening event setup" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/02/new10a.jpg", alt: "Golden wedding decoration" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/02/new7a.jpg", alt: "Outdoor event at twilight" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/02/new6a.jpg", alt: "Dessert display" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/02/new11a.jpg", alt: "Venue at night" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/02/new5a.jpg", alt: "Event food station" },
];

const allImages2 = [
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/03/img_8large.jpg", alt: "Luxury dining setup" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/03/img_7large.jpg", alt: "Outdoor dinner lighting" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/03/img_10large.jpg", alt: "Modern banquet style" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/03/img_9large.jpg", alt: "Table decor close-up" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/03/img_18large.jpg", alt: "Luxury catering display" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/03/img_12large.jpg", alt: "Venue at night" },
];

const allImages3 = [
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/04/pic1.jpg", alt: "Elegant cocktail area" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/04/pic2.jpg", alt: "Outdoor stage design" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/04/pic3.jpg", alt: "Food counters lighting" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/04/pic4.jpg", alt: "Guest dining section" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/04/pic5.jpg", alt: "Elegant centerpiece" },
  { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/04/pic6.jpg", alt: "Night celebration vibes" },
];

const imageSets = [allImages1, allImages2, allImages3];

interface LightboxProps {
  initialIndex: number;
  onClose: () => void;
  galleryId?: number;
}

const Lightbox = ({ initialIndex, onClose, galleryId = 1 }: LightboxProps) => {
  const allImages = imageSets[galleryId - 1];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState(0);
  const [hoverZone, setHoverZone] = useState<"left" | "right" | null>(null);
  const [liked, setLiked] = useState<boolean[]>(Array(allImages.length).fill(false));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transitionStyle, setTransitionStyle] = useState<"flip" | "fade" | "slide" | "zoom">("flip");

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const goToImage = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const togglePlayback = () => setIsPlaying((prev) => !prev);

  const toggleLike = (index: number) => {
    setLiked((prev) => {
      const newLikes = [...prev];
      newLikes[index] = !newLikes[index];
      return newLikes;
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === " ") togglePlayback();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onClose, goToNext, goToPrevious]);

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying) interval = window.setInterval(goToNext, 3000);
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isPlaying, goToNext]);

  const getVariants = (): Variants => {
    switch (transitionStyle) {
      case "flip":
        return {
          enter: (dir: number) => ({
            rotateY: dir > 0 ? 90 : -90,
            opacity: 0,
          }),
          center: {
            rotateY: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeInOut" },
          },
          exit: (dir: number) => ({
            rotateY: dir > 0 ? -90 : 90,
            opacity: 0,
            transition: { duration: 0.6 },
          }),
        } as Variants;

      case "fade":
        return {
          enter: { opacity: 0 },
          center: {
            opacity: 1,
            transition: { duration: 0.8 },
          },
          exit: {
            opacity: 0,
            transition: { duration: 0.6 },
          },
        };

      case "zoom":
        return {
          enter: { scale: 0.8, opacity: 0 },
          center: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.7 },
          },
          exit: {
            scale: 1.2,
            opacity: 0,
            transition: { duration: 0.5 },
          },
        };

      default:
        return {
          enter: (dir: number) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
          }),
          center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.4 },
          },
          exit: (dir: number) => ({
            x: dir > 0 ? -300 : 300,
            opacity: 0,
            transition: { duration: 0.6 },
          }),
        } as Variants;
    }
  };

  const variants = getVariants();

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center overflow-hidden"
      onMouseMove={(e) => {
        const width = window.innerWidth;
        if (e.clientX < width * 0.25) setHoverZone("left");
        else if (e.clientX > width * 0.75) setHoverZone("right");
        else setHoverZone(null);
      }}
      onMouseLeave={() => setHoverZone(null)}
    >
      {/* 🔹 Controls */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex gap-2 sm:gap-4 z-20 p-1 rounded-md flex-wrap">
        <Button onClick={togglePlayback} variant="secondary" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
          {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
        <Button onClick={toggleFullscreen} variant="secondary" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
          {isFullscreen ? <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
        <select
          value={transitionStyle}
          onChange={(e) => setTransitionStyle(e.target.value as any)}
          className="bg-black/60 text-white text-xs sm:text-sm rounded-md px-2 py-1"
        >
          <option value="flip">Flip</option>
          <option value="fade">Fade</option>
          <option value="slide">Slide</option>
          <option value="zoom">Zoom</option>
        </select>
        <Button
          onClick={() => toggleLike(currentIndex)}
          variant="secondary"
          className={`transition-transform ${liked[currentIndex] ? "text-red-500 scale-110" : "text-black hover:text-white"
            }`}
        >
          <Heart className="h-4 w-4 sm:h-5 sm:w-5" fill={liked[currentIndex] ? "red" : "none"} />
        </Button>
      </div>

      <Button onClick={onClose} variant="secondary" size="icon" className="absolute top-2 right-2 sm:top-4 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 z-20">
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      <div className="flex-1 flex items-center justify-center w-full px-2 sm:px-4 relative perspective-[1200px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={allImages[currentIndex].src}
            alt={allImages[currentIndex].alt}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute max-h-[60vh] sm:max-h-[70vh] max-w-[95vw] sm:max-w-full object-contain rounded-xl shadow-2xl border border-gray-700"
            style={{ backfaceVisibility: "hidden" }}
            whileHover={{ scale: 1.05 }}
          />
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            key={`caption-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-16 sm:bottom-20 text-center text-white text-sm sm:text-lg font-medium bg-black/40 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2 rounded-lg max-w-[90%]"
          >
            {allImages[currentIndex].alt}
          </motion.div>
        </AnimatePresence>

        {isPlaying && (
          <motion.div
            key={`progress-${currentIndex}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute bottom-12 sm:bottom-16 left-1/2 transform -translate-x-1/2 h-1 w-[80%] sm:w-[70%] bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-lg"
          />
        )}
      </div>

      {/* ⬅️➡️ Hover Zones */}
      <div className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-start cursor-pointer" onClick={goToPrevious}>
        <AnimatePresence>
          {hoverZone === "left" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="ml-2 sm:ml-6 bg-black/40 p-3 sm:p-5 rounded-full backdrop-blur-md hover:bg-black/60 hover:scale-110 transition-all"
            >
              <ChevronLeft className="h-8 w-8 sm:h-14 sm:w-14 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end cursor-pointer" onClick={goToNext}>
        <AnimatePresence>
          {hoverZone === "right" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="mr-2 sm:mr-6 bg-black/40 p-3 sm:p-5 rounded-full backdrop-blur-md hover:bg-black/60 hover:scale-110 transition-all"
            >
              <ChevronRight className="h-8 w-8 sm:h-14 sm:w-14 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🔹 Thumbnails */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm border-t border-gray-700 p-2 sm:p-3 overflow-x-auto">
        <div className="flex justify-center sm:justify-center gap-2 sm:gap-3 px-2 sm:px-4">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 rounded-md transition-all duration-300 ${index === currentIndex
                ? "ring-2 ring-yellow-500 scale-110 border-2 sm:border-4 border-yellow-500"
                : "opacity-60 hover:opacity-100 border-2 sm:border-4 border-white"
                }`}
            >
              <img
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                className="h-12 w-16 sm:h-16 sm:w-24 md:h-24 md:w-28 object-cover rounded-md"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
