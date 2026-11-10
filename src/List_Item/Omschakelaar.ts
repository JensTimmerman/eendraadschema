import { Electro_Item } from "./Electro_Item";
import { htmlspecialchars, svgTextWidth, trimString } from "../general";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Omschakelaar extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Omschakelaar";
        this.props.adres = "";
        this.props.details = "Omschakelaar";
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Aansluiting", "Domotica", "Domotica module (verticaal)", "Domotica gestuurde verbruiker", "Leiding", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Media", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    }

    preferredChilds() : Array<string> {
        return ["", "Leiding", "Batterij", "Zonnepaneel"];
    }

    getMaxNumChilds(): number {
        return super.getMaxNumChilds() > 0 ? 256 : 0;
    }

    overrideKeys() {
        if (this.props.details == null) this.props.details = "";
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml();
        output += ', Tekst onder object (nieuwe lijn = "|"): ' + this.stringPropToHTML('details',25);
        output += ", Adres: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    addLegendToSVG(mySVG: SVGelement) {
        let lines = htmlspecialchars(this.props.details).split("|");
        let maxWidth = 0;
        for (let line of lines) maxWidth = Math.max(maxWidth, svgTextWidth(htmlspecialchars(line),10,'') + 15);
        let offset = 15 * Math.max(lines.length,0);
        let addresOffset = 0;
        if (trimString(this.props.adres) !== "") addresOffset += 15;
        mySVG.ydown += offset;
        mySVG.xright = Math.max(mySVG.xright, maxWidth);
        for (let line of lines) {
            mySVG.data += '<text x="20" y="' + (mySVG.yup + mySVG.ydown - offset + 10 + addresOffset) + '" style="text-anchor:left;fill:black" font-family="Arial, Helvetica, sans-serif" font-size="10">' + line + '</text>';
            offset -= 15;
        }
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        if (sitplan) {
            mySVG.yup = 25;
            mySVG.ydown = 25;
            mySVG.xleft = 1;
            mySVG.xright = 59;

            SVGSymbols.addSymbol('omschakelaar');
            mySVG.data += '<use xlink:href="#omschakelaar" x="21" y="25"></use>';

            return(mySVG);
        }

        SVGSymbols.addSymbol('sinusVerticaal');

        // Eerst vragen we een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id,"vertical");

        // Dan bepalen we de hoogte van het object
        let heightunaltered = mySVG.yup + mySVG.ydown;
        let height = heightunaltered;
        if (height < 60) height = 60;
        height = Math.max(height,25);

        // Parameters van mySVG aanpassen omdat mySVG nu de Omschakelaar gaat beschrijven
        mySVG.yup = height/2;
        mySVG.ydown = mySVG.yup;
        mySVG.firstChildydown = null;
        mySVG.lastChildyup = null;

        // Nu zetten we de tekening effectief op de goede plaats in het schema
        mySVG.data = '<svg x="70" y="' + (height-heightunaltered)/2 + '">' + mySVG.data + '</svg>';

        // Vervolgens tekenen we de module zelf
        mySVG.xleft = 1;
        mySVG.xright += 70;

        const strokeWidth = "2";
        mySVG.data += '<rect x="21" width="50" y="5" height="' + (height-10) + '" stroke="black" stroke-width="' + strokeWidth + '" fill="none" />';

        mySVG.data += `<line x1="1" x2="21" y1="${mySVG.yup-5}" y2="${mySVG.yup-5}" stroke="black" />` +
                      `<line x1="1" x2="21" y1="${mySVG.yup+5}" y2="${mySVG.yup+5}" stroke="black" />`;

        SVGSymbols.addSymbol('omschakelaar');
        mySVG.data += '<use xlink:href="#omschakelaar" x="26" y="' + mySVG.ydown + '"></use>';

        if (trimString(this.props.details) !== "") this.addLegendToSVG(mySVG);

        if ((this.props.adres !== null) && (trimString(this.props.adres) !== "")) {
            let textX = 45;
            const textY = height + 10;
            const fontSize = 10;
            const padding = 2;
            const textWidth = svgTextWidth(htmlspecialchars(this.props.adres), fontSize, 'font-style:italic');
            if (textWidth > 50) textX += (textWidth-50)/2;
            mySVG.data += '<text x="' + textX + '" y="' + textY + '" style="text-anchor:middle; fill:black; font-style:italic" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.props.adres) + '</text>';
            mySVG.ydown += 15;
            mySVG.xright = Math.max(mySVG.xright, textX + textWidth/2 + padding);
        }

        if (this.heeftVerbruikerAlsKind() && this.getNumChilds() == 0) {
            mySVG.data += `<line x1="70" y1="${mySVG.yup}" x2="${mySVG.xright+mySVG.xleft+1}" y2="${mySVG.yup}" stroke="black" />`;
        }

        return(mySVG);
    }

}
