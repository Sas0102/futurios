import Link from "next/link";


export default function ProductDemo(){

return (

<main className="
min-h-screen
bg-black
text-white
px-10
py-20
">


<div className="
max-w-5xl
mx-auto
">


<h1 className="
text-5xl
font-bold
">

Experience

<span className="
text-orange-500
">

 Futurios AI

</span>

 Voice Platform

</h1>


<p className="
mt-6
text-gray-400
text-lg
">

Create AI voice agents, monitor conversations,
and automate customer interactions.

</p>





<div className="
mt-12
bg-[#111]
border
border-white/10
rounded-3xl
p-10
">


<h2 className="
text-2xl
font-bold
">

AI Voice Dashboard Preview

</h2>



<div className="
grid
md:grid-cols-3
gap-5
mt-8
">


<div className="
bg-black
border
border-white/10
rounded-xl
p-6
">

<p className="text-gray-400">
Calls Today
</p>

<h3 className="
text-4xl
font-bold
mt-2
">

1240

</h3>

</div>




<div className="
bg-black
border
border-white/10
rounded-xl
p-6
">

<p className="text-gray-400">
Active Agents
</p>

<h3 className="
text-4xl
font-bold
mt-2
">

24

</h3>

</div>





<div className="
bg-black
border
border-white/10
rounded-xl
p-6
">

<p className="text-gray-400">
Response Time
</p>

<h3 className="
text-4xl
font-bold
mt-2
">

1.2s

</h3>

</div>


</div>


</div>





<Link

href="/login"

className="
inline-block
mt-10
bg-orange-500
text-black
px-8
py-4
rounded-xl
font-semibold
"

>

Start Using Futurios

</Link>



</div>


</main>

);

}