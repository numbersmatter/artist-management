import { Outlet } from "@remix-run/react";
import SideColumnLayout from "~/server/ui/Layout/SideColumnLayout";


export default function OpportunitiesLayout() {

  return (
    <SideColumnLayout >

      <Outlet />
    </SideColumnLayout>
  );
}

