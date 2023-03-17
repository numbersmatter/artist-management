import type { LoaderArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/server/auth.server";
import { getOpportunityStatusLists } from "~/server/routes-logic/opportunities/opportunities.server";


export async function loader({ params, request }: LoaderArgs) {
  const user = await requireAuth(request);
  
  const oppId = params.oppId ?? "no id"
  const profileId = "milachu92"
  
  if (user.uid !== '8S2uW3Tj5oPBEhQuIAfEJpaCwQM2') {
    redirect('/')
  };
  
  const intents= await getOpportunityStatusLists(profileId, oppId)
  const overviewStats = [
    { name: 'Needs Review', stat: `${intents.review.length}` },
    { name: 'Hold', stat: `${intents.hold.length}` },
    { name: 'Accepted', stat: `${intents.accepted.length}` },
  ]


  return json({ overviewStats })

}



export default function OpportunitiesDashboard() {
  const { overviewStats} = useLoaderData<typeof loader>();
  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">This Opportunities Stats</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {overviewStats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}



