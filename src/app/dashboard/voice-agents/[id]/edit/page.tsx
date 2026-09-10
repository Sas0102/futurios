import AgentEditForm from "@/features/agents/components/AgentEditForm";


export default async function EditAgentPage({

params,

}: {

params: Promise<{
id:string;
}>

}) {

const { id } = await params;


return (

<div>


<h1 className="
text-3xl
font-bold
mb-6
">

Edit Voice Agent

</h1>



<AgentEditForm

agentId={Number(id)}

/>


</div>

);

}
