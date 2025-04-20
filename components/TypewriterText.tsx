"use client";
import { useEffect, useState } from "react";
import useTypewriter from "@/hooks/use-typewriter";

const TypewriterText = ({
  text,
  speed = 20,
  as = "p",
  className = "",
}: {
  text: string;
  speed?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) => {
  const renderedText = useTypewriter(text, speed);
  const Element = as;

  return (
    <Element className={className}>
      {renderedText}
    </Element>
  );
};

export default TypewriterText;
