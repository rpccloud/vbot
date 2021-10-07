
const domainRegex = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export function isValidDomain(v: string): boolean {
    return domainRegex.test(v)
}
