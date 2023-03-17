import { Outlet, useLoaderData } from "@remix-run/react";
import SideColumnLayout from "~/server/ui/Layout/SideColumnLayout";
import {
  BookmarkSquareIcon,
  FireIcon,
  HomeIcon,
  InboxIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";



const navigation = [
  { name: 'Home', to: '/', icon: HomeIcon },
  { name: 'Responses', to: '/opportunities', icon: FireIcon },
  { name: 'Bookmarks', to: '#', icon: BookmarkSquareIcon },
  { name: 'Messages', to: '#', icon: InboxIcon },
  { name: 'Profile', to: '#', icon: UserIcon },
]

const user1 = {
  name: 'Milachu92',
  email: 'emily.selman@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  settingsUrl:"/site/profile"
}

export async function loader({params}:LoaderArgs) {
  
  const nav = navigation
  const user = user1



  return json({nav, user});
}



export default function OpportunitiesLayout() {
  const { user,} = useLoaderData<typeof loader>();

  return (
    <SideColumnLayout
      nav={navigation}
      navBarUser={user}
    >

      <Outlet />
    </SideColumnLayout>
  );
}

