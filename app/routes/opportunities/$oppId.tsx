import { ArrowDownLeftIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { requireAuth } from "~/server/auth.server";
import { getOpportunityStatusLists } from "~/server/routes-logic/opportunities/opportunities.server";
import NavCardList from "~/server/ui/Layout/navCardList";
import SlideOut from "~/server/ui/Layout/SlideOut";




export async function loader({ params, request }: LoaderArgs) {
  const user = await requireAuth(request);

  const oppId = params.oppId ?? "no id"
  const profileId = "milachu92"

  if (user.uid !== '8S2uW3Tj5oPBEhQuIAfEJpaCwQM2') {
    redirect('/')
  };

  const intents = await getOpportunityStatusLists(profileId, oppId);

  const navIntents = [
    {
      title: "Needs Review",
      category: "review",
      cardList: intents.review
    },
    {
      title: "Hold",
      category: "hold",
      cardList: intents.hold,
    },
    {
      title: "Accepted",
      category: "accepted",
      cardList: intents.accepted,
    },
    {
      title: "Declined",
      category: "declined",
      cardList: intents.declined,
    },

  ]


  return json({ intents, navIntents })

}




export default function OpportunitiesMultiColumnLayout() {
  const { intents, navIntents } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState<boolean>(false)

  const intentsOrder = ['review', 'hold', 'accepted', 'declined']

  return (
    <main className="flex flex-1 overflow-hidden">
      {/* Primary column */}
      <section
        aria-labelledby="primary-heading"
        className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto lg:order-last"
      >
        <div className="block py-2 px-2 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-[#9BB52A] py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Choose Another Response
          </button>
          <SlideOut open={open} setOpen={setOpen}>
            <nav className="h-full overflow-y-auto" aria-label="Directory">
              {
                navIntents.map((category) =>
                  <NavCardList
                    key={category.title}
                    title={category.title}
                    //@ts-ignore 
                    category={category.category}
                    // @ts-ignore 
                    cardList={category.cardList} />

                )
              }


            </nav>

          </SlideOut>

        </div>
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
            {
              navIntents.map((category) =>
                <NavCardList
                  key={category.title}
                  title={category.title}
                  //@ts-ignore 
                  category={category.category}
                  // @ts-ignore 
                  cardList={category.cardList} />

              )
            }


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