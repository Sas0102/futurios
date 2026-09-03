"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";


const words = [
  "🤖 Futurios",
  "AI voice agents",
  "handled",
  "2,438 customer calls",
  "while understanding",
  "customer intent",
  "and analyzing",
  "sentiment",
  "in real time.",
  "Every conversation",
  "becomes valuable",
  "business intelligence",
  "that helps teams",
  "deliver better experiences."
];


export default function VoiceAnalyticsStory() {

  const containerRef = useRef<HTMLDivElement>(null);


  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset:[
      "start start",
      "end end"
    ]
  });


  return (

<section
ref={containerRef}
className="
relative
h-[220vh]
"
>


<div
className="
sticky
top-0
h-screen
flex
items-center
justify-center
px-6
"
>


{/* background glow */}

<div
className="
absolute
w-[450px]
h-[450px]
bg-orange-500/10
blur-[130px]
rounded-full
"
/>



<div
className="
relative
max-w-5xl
text-center
"
>


{/* Badge */}

<div
className="
mb-10
inline-flex
items-center
rounded-full
border
border-orange-500/20
bg-orange-500/10
px-4
py-2
text-sm
text-orange-400
"
>
WELCOME TO FUTURIOS
</div>



<h2
className="
text-[24px]
leading-[1.35]
font-semibold
tracking-tight
sm:text-[30px]
md:text-[38px]
lg:text-[42px]
"
>


{
words.map((word,index)=>{


const start=index/(words.length+3);

const end=start+0.12;


const color=useTransform(
scrollYProgress,
[start,end],
[
"#374151",
"#ffffff"
]
);



return (

<motion.span
key={index}
style={{
color
}}
className="
inline
mr-2
"
>

{word}

</motion.span>


)


})

}



</h2>



<p
className="
mt-10
text-sm
uppercase
tracking-[0.3em]
text-gray-600
"
>
Scroll to explore
</p>



</div>



</div>


</section>


  );
}