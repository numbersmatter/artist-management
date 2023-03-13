import { json, LoaderArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Timestamp } from "firebase-admin/firestore";
import { requireAuth } from "~/server/auth.server";
import { readIntentDoc } from "~/server/mila.server";


export async function loader({params, request}:LoaderArgs) {
  await requireAuth(request);
  const intentId = params.intentId ?? "no-intentId"

  const intentDoc = await readIntentDoc("milachu92", intentId)
  if(!intentDoc){
    return redirect("/manage")
  }



  return json({intentDoc});
}


export default function IntentDoc() {
  const {intentDoc } = useLoaderData<typeof loader>()

  const convertTimestamp= (timestamp: Timestamp) =>{
    let date = timestamp.toDate();
    let mm = date.getMonth();
    let dd = date.getDate();
    let yyyy = date.getFullYear();
  
   const  readdate = mm + '/' + dd + '/' + yyyy as string;
    return readdate;
  }

  return (
    <article className="prose prose-xl px-3">
      <h1>{intentDoc.humanReadableId}</h1>
      <p>Status: {intentDoc.status} </p>
      <h3>Step 1</h3>
      
    </article>
  );
}