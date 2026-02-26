import {CUSTOM_SKILLS, NAMESPACE} from "./PF1Settings.js";

export class pf1 implements SystemApi {

    get version() {
        return 2;
    }

    get id() {
        return "pf1";
    }
    async actorRollSkill(actor, skillId){
        if(!Object.keys(actor.system.skills).includes(skillId)){
            Object.entries(actor.system.skills).forEach(([id,skill])=>{
                // @ts-ignore
                if(skill.name && skill.name.toLowerCase().trim() === skillId){
                   skillId = id;
                }
                // @ts-ignore
                if(skill.subSkills){
                    // @ts-ignore
                    Object.entries(skill.subSkills).forEach(([subId,subSkill])=>{
                        // @ts-ignore
                        if(subSkill.name && subSkill.name.toLowerCase().trim() === skillId){
                            skillId = `${id}.subSkills.${subId}`;
                        }
                    })
                }
            });
        }

        const message = await actor.rollSkill(skillId);
        if(!message){
            return null
        }
        return message.rolls[0];
    }

    async actorRollAbility(actor, abilityId){
        const message =  await actor.rollAbilityTest(abilityId);
        if(!message){
            return null
        }
        return message.rolls[0];
    }

    actorCurrenciesGet(actor):Currencies {
        return actor["system"].currency;
    }

    async actorCurrenciesStore(actor, currencies: Currencies): Promise<void> {
        await actor.update({system: {currency: currencies}});
    }

    actorSheetAddTab(sheet, html, actor, tabData:{ id: string, label: string, html: string }, tabBody:string):void {
        const tabs = $(html).find('nav[data-group="primary"]');
        const tabItem = $('<a class="item" data-tab="' + tabData.id + '" title="' + tabData.label + '">'+tabData.html+'</a>');
        tabs.append(tabItem);
        const body = $(html).find(".primary-body");
        const tabContent = $('<div class="tab flexcol" data-group="primary" data-tab="' + tabData.id + '"></div>');
        body.append(tabContent);
        tabContent.append(tabBody);
    }

    actorSheetTabSelector: 'nav[data-group="primary"] [data-tab]';

    itemSheetReplaceContent(app, html, element):void {
        html.find('.sheet-navigation').remove();
        var properties = html.find('.item-properties').clone();
        const sheetBody = html.find('.primary-body');
        sheetBody.addClass("flexrow");
        sheetBody.empty();
        sheetBody.append(properties);
        sheetBody.append(element);
    }

    get configSkills():SkillConfig[] {
        const customSkillString:String = game[NAMESPACE].Settings.get(CUSTOM_SKILLS) || "";
        const skills = Object.entries(CONFIG["PF1"].skills).map(skills => {
            return {
                id: skills[0],
                label: skills[1] as string
            };
        })
        customSkillString.split(",").forEach(skill=>{
            skills.push({id:skill.trim().toLowerCase(), label:skill.trim()})
        });
        return skills;
    }

    get configAbilities():AbilityConfig[] {
        return Object.entries(CONFIG["PF1"].abilitiesShort).map(ab => {
            return {
                id: ab[0],
                label: game["i18n"].localize("PF1.Ability"+ab[1])
            };
        });
    }

    get configCurrencies():CurrencyConfig[] {
        return [
            {
                id: "pp",
                factor: 1000,
                label: game["i18n"].localize("PF1.Currency.Full.pp"),
            },
            {
                id: "gp",
                factor: 100,
                label: game["i18n"].localize("PF1.Currency.Full.gp"),
            },
            {
                id: "sp",
                factor: 10,
                label: game["i18n"].localize("PF1.Currency.Full.sp"),
            },
            {
                id: "cp",
                factor: 1,
                label: game["i18n"].localize("PF1.Currency.Full.cp"),
            }
        ]
    }

    get configCanRollAbility():boolean {
        return true;
    }
    get configLootItemType(): string {
        return "loot";
    }

    get itemPriceAttribute(): string {
        return "system.price";
    }

    get itemQuantityAttribute(): string {
        return "system.quantity";
    }

}