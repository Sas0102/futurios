"use client";


import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";


import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";




const organizationSchema = z.object({

  organization_name:
    z.string()
    .min(2,"Organization name required"),


  industry:
    z.string()
    .min(2,"Industry required"),


  company_size:
    z.string()
    .min(1,"Company size required"),

});




type OrganizationFormData =
z.infer<typeof organizationSchema>;





export default function OrganizationForm(){



const {
register,
handleSubmit,
formState:{errors}

}=useForm<OrganizationFormData>({

resolver:zodResolver(organizationSchema)

});






const onSubmit=(data:OrganizationFormData)=>{


console.log(
"Organization Details:",
data
);


// Later:
// Send to FastAPI


};





return (

<div className="w-full max-w-md rounded-lg border p-6 bg-white">


<h1 className="text-2xl font-bold mb-6">

Create Organization

</h1>




<form
onSubmit={handleSubmit(onSubmit)}
className="space-y-4"
>




<div>

<Label>
Organization Name
</Label>


<Input
placeholder="Futurios Technologies"
{...register("organization_name")}
/>


{
errors.organization_name &&
<p className="text-red-500 text-sm">
{errors.organization_name.message}
</p>
}


</div>





<div>

<Label>
Industry
</Label>


<Input
placeholder="Healthcare"
{...register("industry")}
/>


{
errors.industry &&
<p className="text-red-500 text-sm">
{errors.industry.message}
</p>
}


</div>






<div>

<Label>
Company Size
</Label>


<Input
placeholder="10-50 employees"
{...register("company_size")}
/>


{
errors.company_size &&
<p className="text-red-500 text-sm">
{errors.company_size.message}
</p>
}


</div>






<Button
type="submit"
className="w-full"
>

Continue

</Button>



</form>


</div>


);


}