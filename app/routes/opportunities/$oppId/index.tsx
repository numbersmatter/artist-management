import { json, LoaderArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/server/auth.server";
import { getOpportunityStatusLists } from "~/server/routes-logic/opportunities/opportunities.server";

const stats = [
  { name: 'Needs Review', stat: '71,897' },
  { name: 'Hold', stat: '58.16%' },
  { name: 'Accepted', stat: '24.57%' },
]

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
  const overviewStats = [
    { name: 'Needs Review', stat: `${needsReviewStatuses.length}` },
    { name: 'Hold', stat: `${holdStatuses.length}` },
    { name: 'Accepted', stat: `${acceptedStatuses.length}` },
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



