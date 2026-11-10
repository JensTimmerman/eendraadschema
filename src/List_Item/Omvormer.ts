import { Electro_Item } from "./Electro_Item";
import { htmlspecialchars, svgTextWidth, trimString } from "../general";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Omvormer extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Omvormer";
        this.props.adres = "";
        this.props.inkring = false;
        this.props.micro = false;
        this.props.type_ingang = "AC";
        this.props.type_uitgang = "DC";
        this.props.tekst = "";
        this.props.details = "Merk: ___|Type: ___|S/N: ___|P: ___kW (DC)|P: ___kW (AC)";
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Aansluiting", "Domotica", "Domotica module (verticaal)", "Domotica gestuurde verbruiker", "Leiding", "Meerdere verbruikers", "Splitsing", "Klemmenstrook", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Media", "Microgolfoven", "Motor", "Omvormer", "Omschakelaar", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    }

    getMaxNumChilds(): number {
        return 256;
    }

    overrideKeys() {
        let parent: Electro_Item;
        if (this.props.tekst == null) this.props.tekst = "";
        if (this.props.inkring == null) this.props.inkring = false;
        if (this.props.micro == null) this.props.micro = false;
        if ( ((parent = this.getParent()) != null) && (parent.getType() != "Kring") )
            this.props.inkring = false;
        if (this.props.micro && this.getNumChilds() > 1) {
            this.props.micro = false;
        }
        if (this.props.details == null) this.props.details = "";
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);
        let parent;

        output += "&nbsp;" + this.nrToHtml();
        if ( ((parent = this.getParent()) != null) && (parent.getType() == "Kring") )
            output += "In kring: " + this.checkboxPropToHTML('inkring') + ", ";
        
        // Only show micro checkbox if there's one child or less
        if (this.getNumChilds() <= 1) {
            output += "Micro: " + this.checkboxPropToHTML('micro') + ", ";
        }
        
        output += "Ingang: " + this.selectPropToHTML('type_ingang',["AC","DC"]) + ", ";
        output += "Uitgang: " + this.selectPropToHTML('type_uitgang',["AC","DC"]) + ", ";
        output += "Tekst in object: " + this.stringPropToHTML('tekst',10) + ", ";
        output += 'Tekst onder object (nieuwe lijn = "|"): ' + this.stringPropToHTML('details',25) + ", ";
        output += "Adres/tekst: " + this.stringPropToHTML('adres',5);

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
            SVGSymbols.addSymbol('sinus');

            mySVG.yup = 25;
            mySVG.ydown = 25;

            mySVG.xleft = 1; // foresee at least some space for the conductor
            mySVG.xright = 59;

            if ( (this.props.type_ingang == "AC") && (this.props.type_uitgang == "AC") ) {
                SVGSymbols.addSymbol('omvormer_AC_AC');
                mySVG.data += '<use xlink:href="#omvormer_AC_AC" x="21" y="25"></use>';
            } else if ( (this.props.type_ingang == "DC") && (this.props.type_uitgang == "DC") ) {
                SVGSymbols.addSymbol('omvormer_DC_DC');
                mySVG.data += '<use xlink:href="#omvormer_DC_DC" x="21" y="25"></use>';
            } else {
                SVGSymbols.addSymbol('omvormer_AC_DC');
                mySVG.data += '<use xlink:href="#omvormer_AC_DC" x="21" y="25"></use>';
            }

            return(mySVG);            
        }

        /* else (not sitplan) */

        const text = htmlspecialchars(this.props.tekst);

        SVGSymbols.addSymbol('sinusVerticaal');

        // Eerst vragen we een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id,"vertical");

        // Dan bepalen we de hoogte van het object en zorgen ervoor dat de tekst past
        let heightunaltered = mySVG.yup + mySVG.ydown;
        let height = heightunaltered;
        if (height < 60) height = 60;
        height = Math.max(height,svgTextWidth(htmlspecialchars(text),10,'') + 25);

        // Nu bepalen we hoeveel van de hoogte we effectief in het vierkant willen plaatsen
        // onder bepaade omstandigheden maken we gewoon een blokje, en schalen we niet alles op
        let lowlineOffset = Math.max(0,heightunaltered/2 - mySVG.firstChildydown);
        let highlineOffset = Math.max(0,heightunaltered/2 - mySVG.lastChildyup);
        let rectangleHeight = height;
        if ((this.getNumChilds() <= 1) && (lowlineOffset < 20) && (highlineOffset < 20)) {
            rectangleHeight = Math.max(60,svgTextWidth(htmlspecialchars(text),10,'') + 25);
        }

        // Parameters van mySVG aanpassen omdat mySVG nu de Omvormer gaat beschrijven
        mySVG.yup = height/2;
        mySVG.ydown = mySVG.yup;
        mySVG.firstChildydown = null;
        mySVG.lastChildyup = null;

        // Nu zetten we detekening effectief op de goede plaats in het schema
        mySVG.data = '<svg x="70" y="' + (height-heightunaltered)/2 + '">' + mySVG.data + '</svg>';

        // Vervolgens tekenen we de module zelf
        mySVG.xleft = 1;
        mySVG.xright += 70;

        const strokeWidth = this.props.micro ? "1" : "2";
        mySVG.data += '<rect x="' + (21) + '" width="' + (50) +
                      '" y="' + (5 + (height-rectangleHeight)/2) + '" height="' + (rectangleHeight-10) + '" stroke="black" stroke-width="' + strokeWidth + '" fill="white" />';

        mySVG.data += `<line x1="21" y1="${5 + (height-rectangleHeight)/2}" x2="${21+50}" y2="${5 + (height-rectangleHeight)/2 + (rectangleHeight-10)}" stroke="black" />`;

        if (this.props.inkring) {
            mySVG.data += `<line x1="1" x2="21" y1="${mySVG.yup-5}" y2="${mySVG.yup-5}" stroke="black" />` +
                          `<line x1="1" x2="21" y1="${mySVG.yup+5}" y2="${mySVG.yup+5}" stroke="black" />`; 
        } else {
            mySVG.data += `<line x1="1" x2="21" y1="${mySVG.yup}" y2="${mySVG.yup}" stroke="black" />`;
        }

        // Tekst plaatsen

        if (trimString(text) !== "") {
            const textX = 49;
            const textY = mySVG.yup;
            const fontSize = 10;
            const padding = 2;
            const textWidth = svgTextWidth(htmlspecialchars(text), fontSize, '');
            const rectWidth = textWidth + padding * 2;
            const rectHeight = fontSize + padding * 2;

            mySVG.data += `<rect x="${textX-4 - rectHeight/2}" y="${textY - rectWidth / 2}" width="${rectHeight}" height="${rectWidth}" fill="white" />`;

            mySVG.data += '<text x="' + textX + '" ' + 'y="' + textY + '" '
                +  'transform="rotate(90 ' + textX + ',' + textY + ')" '
                + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"' + '>'
                + text + '</text>';
        }

        // Symbolen toevoegen voor wisselstroom en gelijkstroom aan de ingang

        let symbolY = 5 + height/2 + rectangleHeight/2 - 10 - 8;
        let symbolX = 30;

        switch (this.props.type_ingang) {
            case "AC":
                mySVG.data += `<use xlink:href="#sinusVerticaal" x="${symbolX}" y="${symbolY}" />`;
                break;
            case "DC":
                mySVG.data += `<line x1="${symbolX+2}" y1="${symbolY-7.5-10}" x2="${symbolX+2}" y2="${symbolY+7.5-10}" stroke="black" stroke-dasharray="3" />`
                           +  `<line x1="${symbolX-2}" y1="${symbolY-7.5-10}" x2="${symbolX-2}" y2="${symbolY+7.5-10}" stroke="black" />`;
                break;
        }

        // Symbolen toevoegen voor wisselstroom en gelijkstroom aan de uitgang

        symbolY = 12 + (height-rectangleHeight)/2 + 10 + 12;
        symbolX = 64;

        switch (this.props.type_uitgang) {
            case "AC":
                mySVG.data += `<use xlink:href="#sinusVerticaal" x="${symbolX}" y="${symbolY}" />`;
                break;
            case "DC":
                mySVG.data += `<line x1="${symbolX+2}" y1="${symbolY-7.5-10}" x2="${symbolX+2}" y2="${symbolY+7.5-10}" stroke="black" stroke-dasharray="3" />`
                           +  `<line x1="${symbolX-2}" y1="${symbolY-7.5-10}" x2="${symbolX-2}" y2="${symbolY+7.5-10}" stroke="black" />`;
                break;
        }

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