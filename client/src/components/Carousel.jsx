import React, { useEffect, useState } from "react";
import { animate, useMotionValue, motion } from "motion/react";
import Card from "./ui/Card";
import sliderData from "../data/sliderData.json";
import useMeasure from "react-use-measure";

const Carousel = () => {
  const FAST_DURATION = 25;
  const SLOW_DURATION = 75;

  const [duration, setDuration] = useState(FAST_DURATION);
  let [ref, { width }] = useMeasure();

  const xTranslation = useMotionValue(0);
  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    let controls;
    let finalPosition = -width / 2 - 8;

    if (mustFinish) {
      controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
        ease: "linear",
        duration: duration * (1 - xTranslation.get() / finalPosition),
        onComplete: () => {
          setMustFinish(false);
          setRerender(!rerender);
        },
      });
    } else {
      controls = animate(xTranslation, [0, finalPosition], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
      });
    }

    return controls?.stop;
  }, [rerender, xTranslation, duration, width]);

  return (
    <div className="relative w-full overflow-hidden py-8 pb-16">
      <div ref={ref} className="w-max flex gap-4">
        <motion.div
          className="flex gap-4 will-change-transform"
          style={{ x: xTranslation }}
          onHoverStart={() => {
            setMustFinish(true);
            setDuration(SLOW_DURATION);
          }}
          onHoverEnd={() => {
            setMustFinish(true);
            setDuration(FAST_DURATION);
          }}
        >
          {[...sliderData, ...sliderData].map((item, index) => (
            <Card image={item.name} key={index} id={item.id} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Carousel;
