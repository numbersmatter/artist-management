import { json, LoaderArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/server/auth.server";
import { getAllIntents } from "~/server/mila.server";

export async function loader({ params, request }: LoaderArgs) {
  const user = await requireAuth(request);

  if (user.uid !== '8S2uW3Tj5oPBEhQuIAfEJpaCwQM2') {
    redirect('/')
  }

  const submittedIntents = await getAllIntents("milachu92");

  return json({ submittedIntents })

}



export default function OpportunitiesMultiColumnLayout() {
  const {submittedIntents} = useLoaderData<typeof loader>()
  
  
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
        <h3>List of Submissions</h3>
        <p>Total Number</p>
        <ul className="grid grid-cols-1 gap-6">

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
                {/* <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src={person.imageUrl} alt="" /> */}
              </div>
              <div>
                
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  </main>
);
}