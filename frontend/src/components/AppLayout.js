import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

function AppLayout(){

return(

<div>

{/* Page content */}
<div style={{paddingBottom:"80px"}}>
<Outlet/>
</div>

{/* Bottom Navigation */}
<BottomNav/>

</div>

);

}

export default AppLayout;