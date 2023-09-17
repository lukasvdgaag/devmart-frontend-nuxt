import {RouteLocation} from "vue-router";

export default {

    getEnumKeys(enumObject: any): string[] {
        return Object.keys(enumObject).filter(key => isNaN(Number(key)));
    },

    capFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    formatMoney(input: number, withSymbol: boolean = true): string {
        // format the money with locale nl-NL and currency EUR and only include the symbol if withSymbol is true
        return new Intl.NumberFormat(withSymbol ? 'nl-NL' : 'fr-FR', {
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: withSymbol ? 'symbol' : 'code'
        }).format(input);
    },

    formatNumber(input: number): string {
        return new Intl.NumberFormat('nl-NL').format(input);
    },

    async getBase64(file: File): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string | null);
            reader.onerror = error => reject(error);
        });
    },

    formatFileSize(bytes: number, decimals: number = 2): string {
        // format the file size in bytes to a readable format
        if (bytes === 0) return '0 B';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    getWikiSidebarItemName(route: RouteLocation) {
        const name = route.path.split('/').pop()?.replaceAll(/[-.]/g, ' ');
        return route.meta?.name ?? (name === '' ? 'Introduction' : name);
    }

}