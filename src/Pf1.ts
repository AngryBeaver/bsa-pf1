export class pf1 implements SystemApi {

    get version() {
        return 2;
    }

    get id() {
        return "pf1";
    }

    async actorRollSkill(actor, skillId){
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
        return Object.entries(CONFIG["PF1"].skills).map(skills => {
            return {
                id: skills[0],
                label: skills[1] as string
            };
        })
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
                label: game["i18n"].localize("PF1.CurrencyPlatinumP"),
            },
            {
                id: "gp",
                factor: 100,
                label: game["i18n"].localize("PF1.CurrencyGoldP"),
            },
            {
                id: "sp",
                factor: 10,
                label: game["i18n"].localize("PF1.CurrencySilverP"),
            },
            {
                id: "cp",
                factor: 1,
                label: game["i18n"].localize("PF1.CurrencyCopperP"),
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