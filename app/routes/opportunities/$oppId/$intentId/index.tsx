import type { LoaderArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/server/auth.server";
import { getIntentResponses, readIntentDoc, readMilaImageUpload } from "~/server/mila.server";
import type { Field } from "~/server/routes-logic/formBuilder/types";


export async function loader({ params, request }: LoaderArgs) {
  await requireAuth(request);
  const intentId = params.intentId ?? "no-intentId"

  const intentDoc = await readIntentDoc("milachu92", intentId)
  if (!intentDoc) {
    return redirect("/manage")
  }
  const responses = await getIntentResponses("milachu92", intentId);

  const imagesUploadDoc = await readMilaImageUpload("milachu92", intentId, "step-4a")
  const imgsUploaded = imagesUploadDoc ? imagesUploadDoc.imgList : []

  const numChar: Field = {
    fieldId: "numchar",
    type: "select",
    label: "Number of Characters",
    options: [
      { label: "1 Character", value: "one_char" },
      { label: "1.5 Characters", value: "one_half_char" },
      { label: "2 Characters", value: "two_char" },
      { label: "2.5 Characters", value: "two_half_char" },
      { label: "3 Characters", value: "three_char" },
    ]
  }


  const step1 = responses.find((doc) => doc.docId === "step-1")?.fieldResponses
  const step2 = responses.find((doc) => doc.docId === "step-2")?.fieldResponses
  const step3Raw = responses.find((doc) => doc.docId === "step-3")?.fieldResponses
  const step4 = responses.find((doc) => doc.docId === "step-4")?.fieldResponses
  const step5 = responses.find((doc) => doc.docId === "step-5")?.fieldResponses
  const step6Raw = responses.find((doc) => doc.docId === "step-6")?.fieldResponses
  const step7 = responses.find((doc) => doc.docId === "step-7")?.fieldResponses

  const numcharOptions = [
    { label: "1 Character", value: "one_char" },
    { label: "1.5 Characters", value: "one_half_char" },
    { label: "2 Characters", value: "two_char" },
    { label: "2.5 Characters", value: "two_half_char" },
    { label: "3 Characters", value: "three_char" },
  ];

  const findDisplayLabel = (value: string, options: { label: string, value: string }[]) => {
    const optionSelected = options.find(option => option.value == value)

    const displayLabel = optionSelected ? optionSelected.label : "invalid option selected"

    return displayLabel
  }


  const step3User = step3Raw ?? { numchar: "invalid option" }
  const step3 = findDisplayLabel(step3User["numchar"], numcharOptions)
  const step6User = step6Raw ?? {
    backgroundDetails: "",
    backgroundType: "",
    detailLevel: "",
  };

  const detailLevelOptions = [
    { label: "Simple Background", value: "simple" },
    { label: "Detailed Background", value: "detailed" },
  ];

  const bgTypeOptions = [
    { label: "Mila's Bedroom", value: "bedroom" },
    { label: "Forest or Park", value: "forest" },
    { label: "Clawfee House", value: "clawfee" },
    { label: "Night Club", value: "nightclub" },
    { label: "Bathroom", value: "bathroom" },
    { label: "Daytime Beach", value: "beach" },
    { label: "Other Background", value: "other" },
  ]
  const step6 = {
    detailLevel: findDisplayLabel(step6User["detailLevel"], detailLevelOptions),
    backgroundType: findDisplayLabel(step6User["backgroundType"], bgTypeOptions),
    backgroundDetails: step6User["backgroundDetails"]
  }



  const responsesObj = {
    step1: step1 ?? { email: "no email" },
    step2: step2 ?? { title: "no title given" },
    step3: step3,
    step4: step4 ?? { charArea: "no additional details" },
    step5: step5 ?? { charActions: "no email" },
    step6: step6 ?? {
      backgroundDetails: "",
      backgroundType: "",
      detailLevel: "",
    },
    step7: step7 ?? { additionalInfo: "" },
  }



  return json({ intentDoc, responses, responsesObj, imgsUploaded });
}

const tabs = [
  { name: 'Accept', href: '#', current: true },
  { name: 'Decline', href: '#', current: false },
  { name: 'Hold', href: '#', current: false },

]

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function IntentDoc() {
  const { intentDoc, responsesObj, imgsUploaded } = useLoaderData<typeof loader>()



  return (
    <article className="px-2 py-2">
      <div className=" rounded-xl  border-4 px-4 py-3 max-w-3xl">
        <div>
          <h3 className="text-base font-semibold leading-6 text-gray-900 capitalize">{intentDoc.humanReadableId}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Request Details</p>
        </div>
        <div className="mt-5 border-t border-gray-200">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {responsesObj.step1["email"]}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{responsesObj.step2["title"]}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Number of Characters</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {responsesObj.step3}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Character References</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {responsesObj.step4["charArea"]}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">
                Character Actions
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {responsesObj.step5["charActions"]}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Background Level of Detail</dt>
              <dd className="mt-1  pb-3 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {responsesObj.step6.detailLevel}
              </dd>
              <dt className="text-sm font-medium text-gray-500">
                Background Type
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {responsesObj.step6.backgroundType}
              </dd>
              <dt className="text-sm font-medium text-gray-500">Background Details</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {responsesObj.step6["backgroundDetails"] ?? "User left this section blank"}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">
                Additional Details
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {responsesObj.step7["additionalInfo"]}
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="text-xl text-slate-700">Uploaded Images:</h4>
          <ul
            className=" pt-2 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
          >
            {

              imgsUploaded.length > 0 ?
                imgsUploaded.map((imageData
                ) => (
                  <li key={imageData.url} className="relative">
                    <Link to={imageData.url} className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                      <img src={imageData.url} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                    </Link>
                    <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{imageData.description}</p>
                  </li>
                ))
                : <div className="mx-auto ">

                  <p className="text-xl text-slate-500"> No images uploaded</p>
                </div>

            }
          </ul>



        </div>




      
      <div className=" py-4 block">
        <div className="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
          {tabs.map((tab, tabIdx) => (
            <button
              key={tab.name}
            
              className={classNames(
                tab.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
                tabIdx === 0 ? 'rounded-l-lg' : '',
                tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10'
              )}
              aria-current={tab.current ? 'page' : undefined}
            >
              <span>{tab.name}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  tab.current ? 'bg-indigo-500' : 'bg-transparent',
                  'absolute inset-x-0 bottom-0 h-0.5'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      </div>

    </article>
  );
}


function Example() {
  return (
    <div>
      <div>
        <h3 className="text-base font-semibold leading-6 text-gray-900">Applicant Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
      </div>
      <div className="mt-5 border-t border-gray-200">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Margot Foster</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Application for</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Backend Developer</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">margotfoster@example.com</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Salary expectation</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">$120,000</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">About</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
              qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
              pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Attachments</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">

                  <div className="ml-4 flex-shrink-0">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Download
                    </a>
                  </div>
                </li>
                <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                  <div className="flex w-0 flex-1 items-center">
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Download
                    </a>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}



