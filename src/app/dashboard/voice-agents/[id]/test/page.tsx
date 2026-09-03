"use client";


import { use, useRef, useState } from "react";



export default function VoiceTestPage({

params,

}: {

params: Promise<{
id:string;
}>;

}) {



const {id} = use(params);



const [recording,setRecording] = useState(false);

const [audioURL,setAudioURL] = useState("");

const [transcript,setTranscript] = useState("");



const mediaRecorder = useRef<MediaRecorder | null>(null);


const audioChunks = useRef<Blob[]>([]);





const startRecording = async()=>{


try{


const stream =
await navigator.mediaDevices.getUserMedia({

audio:true

});



const recorder =
new MediaRecorder(stream);



mediaRecorder.current = recorder;



audioChunks.current=[];




recorder.ondataavailable = (event)=>{


audioChunks.current.push(
event.data
);


};





recorder.onstop = ()=>{


const audioBlob =
new Blob(

audioChunks.current,

{
type:"audio/webm"
}

);



const url =
URL.createObjectURL(
audioBlob
);



setAudioURL(url);



};




recorder.start();



setRecording(true);



}

catch(error){


console.log(
"Microphone error:",
error
);


}



};







const stopRecording = ()=>{


if(mediaRecorder.current){


mediaRecorder.current.stop();


}


setRecording(false);



};








return (

<div className="space-y-6">


<h1 className="
text-3xl
font-bold
">

Voice Test

</h1>




<p className="
text-gray-500
">

Testing Agent ID: {id}

</p>





<button

onClick={
recording
?
stopRecording
:
startRecording
}


className="
bg-black
text-white
px-6
py-3
rounded-lg
"

>


{

recording

?

"Stop Recording"

:

"Start Recording"

}


</button>






{
audioURL && (

<div className="
space-y-4
">


<h2 className="
font-semibold
">

Your Recording

</h2>




<audio

controls

src={audioURL}

/>




<button

className="
bg-blue-600
text-white
px-5
py-2
rounded-lg
"

onClick={()=>{


setTranscript(
"Hello, this is a mock transcript from the AI voice agent."
);


}}

>

Generate Mock Transcript

</button>



</div>

)

}






{
transcript && (

<div className="
border
rounded-lg
p-4
">


<h2 className="
font-semibold
">

Transcript

</h2>


<p>

{transcript}

</p>



</div>

)

}





</div>

);


}