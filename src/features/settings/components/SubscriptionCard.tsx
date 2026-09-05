interface Props {

subscription:any;

}


export default function SubscriptionCard(
{subscription}:Props
){


return (

<div className="border rounded-xl p-5">


<h2 className="font-bold text-xl">

Current Plan

</h2>


<p className="mt-3">

{
subscription?.plan?.display_name
}

</p>


<p>

API Access:

{
subscription?.plan?.limits?.api_access
?
"Yes"
:
"No"
}

</p>


</div>

)

}
