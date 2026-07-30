import AgentEditForm from "@/features/agents/components/AgentEditForm";


export default function EditAgentPage({

params,

}: {

params:{
id:string;
}

}) {


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

agentId={Number(params.id)}

/>


</div>

);

}