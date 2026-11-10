import { Electro_Item } from "./Electro_Item";
import { htmlspecialchars, svgTextWidth, trimString } from "../general";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Elektriciteitsmeter extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Elektriciteitsmeter";
        this.props.adres = "";  
        this.props.details = "";
    }      

    overrideKeys() {
        if (this.props.details == null) this.props.details = "";
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml();
        output += ', Tekst onder object (nieuwe lijn = "|"): ' + this.stringPropToHTML('details',25);
        output += "Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    addLegendToSVG(mySVG: SVGelement) {
        let lines = htmlspecialchars(this.props.details).split("|");
        let maxWidth = 0;
        for (let line of lines) maxWidth = Math.max(maxWidth, svgTextWidth(htmlspecialchars(line),10,'') + 15);
        let offset = 15 * Math.max(lines.length,0);
        mySVG.ydown += offset;
        mySVG.xright = Math.max(mySVG.xright, maxWidth);
        for (let line of lines) {
            mySVG.data += '<text x="20" y="' + (mySVG.yup + mySVG.ydown - offset + 10) + '" style="text-anchor:left;fill:black" font-family="Arial, Helvetica, sans-serif" font-size="10">' + line + '</text>';
            offset -= 15;
        }
        mySVG.ydown += 5;
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('elektriciteitsmeter');

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = (sitplan? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
                   + '<use xlink:href="#elektriciteitsmeter" x="21" y="25"></use>';
        
        mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,60,15));

        if (!sitplan) {
            if (trimString(this.props.details) !== "") this.addLegendToSVG(mySVG);
        }

        return(mySVG);
    }

}
