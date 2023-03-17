import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import { json, LoaderArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/server/auth.server";
import { getAllOportunities } from "~/server/mila.server";


export async function loader({params, request}:LoaderArgs) {
  const user = await requireAuth(request);

  const oppId = params.oppId ?? "no id"
  const profileId = "milachu92"

  if (user.uid !== '8S2uW3Tj5oPBEhQuIAfEJpaCwQM2') {
    redirect('/')
  };
  const opportunities= await getAllOportunities("milachu92");

  return json({opportunities});
}


export default function OpportunitiesPage() {
  const { opportunities}=useLoaderData<typeof loader>();
  
  return (
    <div className="px-2 py-2">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Opportunities</h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Ability for people to complete your forms
        </p>
      </div>



    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {opportunities.map((opportunity) => (
        <li key={opportunity.opportunityId} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-sm font-medium text-gray-900">{opportunity.name}</h3>
                <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  {opportunity.status}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">{opportunity.name}</p>
            </div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <Link
                  to={`${opportunity.opportunityId}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  Open
                </Link>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <Link
                  to={`${opportunity.opportunityId}`}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  Close
                </Link>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>



    </div>
    );
}