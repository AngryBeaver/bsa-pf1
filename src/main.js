import {pf1} from "./Pf1.js";
import {NAMESPACE,PF1Settings} from "./PF1Settings.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new pf1());
});

Hooks.on("ready", async function(){
    game[NAMESPACE] = game[NAMESPACE] || {};
    game[NAMESPACE].Settings = new PF1Settings();
})