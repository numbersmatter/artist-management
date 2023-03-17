import type { LoaderArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {  NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/server/auth.server";
import { getOpportunityStatusLists } from "~/server/routes-logic/opportunities/opportunities.server";




export async function loader({ params, request }: LoaderArgs) {
  const user = await requireAuth(request);

  const oppId = params.oppId ?? "no id"
  const profileId = "milachu92"

  if (user.uid !== '8S2uW3Tj5oPBEhQuIAfEJpaCwQM2') {
    redirect('/')
  };

  const { 
    needsReviewStatuses,
    holdStatuses, 
    declinedStatuses,
    acceptedStatuses 
  }= await getOpportunityStatusLists(profileId, oppId)


  return json({ holdStatuses, needsReviewStatuses, declinedStatuses, acceptedStatuses })

}




export default function OpportunitiesMultiColumnLayout() {
  const {
   
    holdStatuses,
    needsReviewStatuses,
    declinedStatuses,
    acceptedStatuses
  } = useLoaderData<typeof loader>()



  return (
    <main className="flex flex-1 overflow-hidden">
      {/* Primary column */}
      <section
        aria-labelledby="primary-heading"
        className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto lg:order-last"
      >
        <h1 id="primary-heading" className="sr-only">
          Request details
        </h1>

        {/* Your content */}
        <Outlet />
      </section>

      {/* Secondary column (hidden on smaller screens) */}
      <aside className="hidden lg:order-first lg:block lg:flex-shrink-0">
        <div className="relative flex h-full w-96 flex-col overflow-y-auto border-r border-gray-200 bg-white">
          {/* Your content */}
          <nav className="h-full overflow-y-auto" aria-label="Directory">
            <div key={"Needs Review"} className="relative">
              <div className="sticky top-0 z-10 border-t border-b border-gray-200 bg-orange-400 px-6 py-1 text-sm font-medium text-gray-500">
                <h3 className="text-xl" >Needs Review ( {needsReviewStatuses.length} )</h3>
              </div>
              <ul className="relative z-0 divide-y divide-gray-200">
                {needsReviewStatuses.map((intentDoc) => (
                  <li key={intentDoc.intentId} className="bg-white">
                    <NavLink to={intentDoc.intentId ?? "error"}
                      className={({ isActive }) => isActive ? "relative flex items-center space-x-3 px-6 py-5 bg-slate-400" : "relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50"}
                    >

                      <div className="min-w-0 flex-1">

                        {/* Extend touch target to entire panel */}
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">{intentDoc.humanReadableId}</p>
                        <p className="truncate text-sm text-gray-500">hold role</p>
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div key={"Hold"} className="relative">
              <div className="sticky top-0 z-10 border-t border-b border-gray-200 bg-yellow-300 px-6 py-1 text-sm font-medium text-gray-500">
                <h3 className="text-xl">Hold ( {holdStatuses.length} ) </h3>
              </div>
              <ul className="relative z-0 divide-y divide-gray-200">
                {holdStatuses.map((intentDoc) => (
                  <li key={intentDoc.intentId} className="bg-white">
                    <NavLink to={intentDoc.intentId ?? "error"}
                      className={({ isActive }) => isActive ? "relative flex items-center space-x-3 px-6 py-5 bg-slate-400" : "relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50"}
                    >
                      <div className="flex-shrink-0">
                        {/* <img className="h-10 w-10 rounded-full" src={intentDoc.imageUrl} alt="" /> */}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                        //  to={intentDoc.intentId ?? "error"} 
                        //   className={ ({isActive})=> isActive ?  "bg-slate-400" :  "focus:outline-none" }
                        >
                          {/* Extend touch target to entire panel */}
                          <span className="absolute inset-0" aria-hidden="true" />
                          <p className="text-sm font-medium text-gray-900">{intentDoc.humanReadableId}</p>
                          <p className="truncate text-sm text-gray-500">hold role</p>
                        </div>
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div key={"Accepted"} className="relative">
              <div className="sticky top-0 z-10 border-t border-b border-gray-200 bg-green-400 px-6 py-1 text-sm font-medium text-gray-500">
                <h3 className="text-xl">Accepted ( {acceptedStatuses.length} )</h3>
              </div>
              <ul className="relative z-0 divide-y divide-gray-200">
                {acceptedStatuses.map((intentDoc) => (
                  <li key={intentDoc.intentId} className="bg-white">
                    <NavLink to={intentDoc.intentId ?? "error"}
                      className={({ isActive }) => isActive ? "relative flex items-center space-x-3 px-6 py-5 bg-slate-400" : "relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50"}
                    >
                      <div className="flex-shrink-0">
                        {/* <img className="h-10 w-10 rounded-full" src={intentDoc.imageUrl} alt="" /> */}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                        >
                          {/* Extend touch target to entire panel */}
                          <span className="absolute inset-0" aria-hidden="true" />
                          <p className="text-sm font-medium text-gray-900">{intentDoc.humanReadableId}</p>
                          <p className="truncate text-sm text-gray-500">hold role</p>
                        </div>
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div key={"Declined"} className="relative">
              <div className="sticky top-0 z-10 border-t border-b border-gray-200 bg-red-300 px-6 py-1 text-sm font-medium text-gray-500">
                <h3 className="text-xl">Declined ( {declinedStatuses.length} )</h3>
              </div>
              <ul className="relative z-0 divide-y divide-gray-200">
                {declinedStatuses.map((intentDoc) => (
                  <li key={intentDoc.intentId} className="bg-white">
                    <NavLink to={intentDoc.intentId ?? "error"}
                      className={({ isActive }) => isActive ? "relative flex items-center space-x-3 px-6 py-5 bg-slate-400" : "relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50"}
                    >
                      <div className="flex-shrink-0">
                        {/* <img className="h-10 w-10 rounded-full" src={intentDoc.imageUrl} alt="" /> */}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div >
                          {/* Extend touch target to entire panel */}
                          <span className="absolute inset-0" aria-hidden="true" />
                          <p className="text-sm font-medium text-gray-900">{intentDoc.humanReadableId}</p>
                          <p className="truncate text-sm text-gray-500">hold role</p>
                        </div>
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>


          </nav>
          <h2>Needs Review2</h2>
          <p>Total Number</p>
          <ul className="grid grid-cols-1 gap-6">
            {/* 
          {submittedIntents.map((intentDoc) => (
            <li key={intentDoc.intentId} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <Link to={intentDoc.intentId} className="truncate text-sm font-medium text-gray-900">{intentDoc.humanReadableId}</Link>
                    <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      {intentDoc.status}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-500">{intentDoc.intentId}</p>
                </div>
             
              </div>
              <div>
                
              </div>
            </li>
          ))} */}
          </ul>
        </div>
      </aside>
    </main>
  );
}