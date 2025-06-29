import { SalesforceGlobal, SalesforceGlobalFiltered } from "@types";

export function filterSalesforceGlobal(global: SalesforceGlobal): SalesforceGlobalFiltered {
    return {
        sobjects: global.sobjects.map(s => s.name)
    }
}