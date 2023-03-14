import { json, LoaderArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Timestamp } from "firebase-admin/firestore";
import { requireAuth } from "~/server/auth.server";
import { getIntentResponses, readIntentDoc, readMilaImageUpload } from "~/server/mila.server";


export async function loader({params, request}:LoaderArgs) {
  await requireAuth(request);
  const intentId = params.intentId ?? "no-intentId"

  const intentDoc = await readIntentDoc("milachu92", intentId)
  if(!intentDoc){
    return redirect("/manage")
  }
  const responses = await getIntentResponses("milachu92", intentId);

  const imagesUploadDoc = await readMilaImageUpload("milachu92", intentId, "step-4a")
  const imgsUploaded = imagesUploadDoc ? imagesUploadDoc.imgList : []
  
  const step1 = responses.find((doc) => doc.docId === "step-1")?.fieldResponses
  const step2 = responses.find((doc) => doc.docId === "step-2")?.fieldResponses
  const step3 = responses.find((doc) => doc.docId === "step-3")?.fieldResponses
  const step4 = responses.find((doc) => doc.docId === "step-4")?.fieldResponses
  const step5 = responses.find((doc) => doc.docId === "step-5")?.fieldResponses
  const step6 = responses.find((doc) => doc.docId === "step-6")?.fieldResponses
  const step7 = responses.find((doc) => doc.docId === "step-7")?.fieldResponses

  const numcharOptions= [
    {label: "1 Character", value:"one_char"},
    {label: "1.5 Characters", value:"one_half_char"},
    {label: "2 Characters", value:"two_char"},
    {label: "2.5 Characters", value:"two_half_char"},
    {label: "3 Characters", value:"three_char"},
  ];

  const findDisplayLabel = ( value: string, options:{label:string, value:string}[])=>{
    const optionSelected= options.find(option => option.value== value)

    const displayLabel = optionSelected ? optionSelected.label : "invalid option selected"

    return displayLabel
  }




  const responsesObj = {
    step1: step1 ?? {email:"no email"},
    step2: step2 ?? {title:"no title given"},
    step3: step3 ?? {numchar: "invalid option"},
    step4: step4 ?? {charArea:"no additional details"},
    step5: step5 ?? {charActions:"no email"},
    step6: step6 ?? {
      backgroundDetails :"",
      backgroundType:"",
      detailLevel:"",},
    step7: step7 ?? {additionalInfo:""},
  }



  return json({intentDoc, responses, responsesObj, imgsUploaded});
}


export default function IntentDoc() {
  const {intentDoc, responsesObj, imgsUploaded } = useLoaderData<typeof loader>()

  

  return (
    <article className="prose prose-xl px-3">
      <h1>{intentDoc.humanReadableId}</h1>
      <p>Status: {intentDoc.status} </p>
      <h4>Step 1</h4>
      <p>Email: { responsesObj.step1["email"]}</p>
      <h4>Step 2</h4>
      <p>Title: { responsesObj.step2["title"]}</p>
      <h4>Step 3</h4>
      <p>Number of Characters: { responsesObj.step3["numchar"]}</p>
      <h4>Step 4</h4>
      <p>Reference Links: { responsesObj.step4["charArea"]}</p>
      <h4>Step 5</h4>
      <p>Character Actions: { responsesObj.step4["charActions"]}</p>
      <h4>Step 6</h4>
      <p>Background Details: { responsesObj.step6["backgroundDetails"]}</p>
      <p>Background Type: { responsesObj.step6["backgroundType"]}</p>
      <p>Background Level of Detail: { responsesObj.step6["detailLevel"]}</p>
      <h4>Step 7</h4>
      <p>Additional Details: { responsesObj.step7["additionalInfo"]}</p>
      <h4 className="text-xl text-slate-700">Uploaded Images:</h4>
                  <ul
                    className=" pt-2 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                  >
                    {
                    
                    imgsUploaded.length > 0 ?
                    imgsUploaded.map((imageData
                    ) => (
                      <li key={imageData.url} className="relative">
                        <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                          <img src={imageData.url} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                        </div>
                        <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{imageData.description}</p>
                      </li>
                    ))
                    : <div className="mx-auto ">
                      
                      <p className="text-xl text-slate-500"> No images uploaded</p>
                      </div>
                  
                  }
                  </ul>


    </article>
  );
}