import {pf1} from "./Pf1.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new pf1());
});