import { json, LoaderArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/server/auth.server";
import { getAllArtistStatuses, getAllIntents } from "~/server/mila.server";


const directory: { [letter: string]: any[] } = {
  A: [
    {
      id: 1,
      name: 'Leslie Abbott',
      role: 'Co-Founder / CEO',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 2,
      name: 'Hector Adams',
      role: 'VP, Marketing',
      imageUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 3,
      name: 'Blake Alexander',
      role: 'Account Coordinator',
      imageUrl:
        'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 4,
      name: 'Fabricio Andrews',
      role: 'Senior Art Director',
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  B: [
    {
      id: 5,
      name: 'Angela Beaver',
      role: 'Chief Strategy Officer',
      imageUrl:
        'https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 6,
      name: 'Yvette Blanchard',
      role: 'Studio Artist',
      imageUrl:
        'https://images.unsplash.com/photo-1506980595904-70325b7fdd90?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 7,
      name: 'Lawrence Brooks',
      role: 'Content Specialist',
      imageUrl:
        'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
}



export async function loader({ params, request }: LoaderArgs) {
  const user = await requireAuth(request);

  const oppId = params.oppId ?? "no id"

  if (user.uid !== '8S2uW3Tj5oPBEhQuIAfEJpaCwQM2') {
    redirect('/')
  };

  const artistStatuses = await getAllArtistStatuses("milachu92", oppId )
  const submittedIntents = await getAllIntents("milachu92");

  const holdStatuses = artistStatuses
  .filter(doc=> doc.reviewStatus === "hold")
  .map((doc)=>{
    const intentDoc = submittedIntents.find(intent=> intent.intentId === doc.statusId)
    return { ...intentDoc}
  })


  return json({ submittedIntents, holdStatuses })

}




export default function OpportunitiesMultiColumnLayout() {
  const { submittedIntents } = useLoaderData<typeof loader>()

  const statusDirectory = {
    "Review": submittedIntents,
    "Hold": [],
    "Accepted": [],
    "Declined": [],
  }


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
              <div className="sticky top-0 z-10 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
                <h3 className="text-xl" >Needs Review</h3>
              </div>
              <ul className="relative z-0 divide-y divide-gray-200">
                {submittedIntents.map((intentDoc) => (
                  <li key={intentDoc.intentId} className="bg-white">
                    <div className="relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        {/* <img className="h-10 w-10 rounded-full" src={intentDoc.imageUrl} alt="" /> */}
                      </div>
                      <div className="min-w-0 flex-1">
                        <a href="#" className="focus:outline-none">
                          {/* Extend touch target to entire panel */}
                          <span className="absolute inset-0" aria-hidden="true" />
                          <p className="text-sm font-medium text-gray-900">{intentDoc.humanReadableId}</p>
                          <p className="truncate text-sm text-gray-500">hold role</p>
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div key={"Hold"} className="relative">
              <div className="sticky top-0 z-10 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
                <h3 className="text-xl">Hold</h3>
              </div>
              <ul className="relative z-0 divide-y divide-gray-200">
                {submittedIntents.map((intentDoc) => (
                  <li key={intentDoc.intentId} className="bg-white">
                    <div className="relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        {/* <img className="h-10 w-10 rounded-full" src={intentDoc.imageUrl} alt="" /> */}
                      </div>
                      <div className="min-w-0 flex-1">
                        <a href="#" className="focus:outline-none">
                          {/* Extend touch target to entire panel */}
                          <span className="absolute inset-0" aria-hidden="true" />
                          <p className="text-sm font-medium text-gray-900">{intentDoc.humanReadableId}</p>
                          <p className="truncate text-sm text-gray-500">hold role</p>
                        </a>
                      </div>
                    </div>
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