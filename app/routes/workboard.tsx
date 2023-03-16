import { Outlet } from "@remix-run/react";
import SideColumnLayout from "~/server/ui/Layout/SideColumnLayout";


export default function WorkBoardLayout() {
  
  return (
    <SideColumnLayout>
      <Outlet/>
    </SideColumnLayout>
  );
}