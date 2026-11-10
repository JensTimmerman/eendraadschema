import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Kookfornuis extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Kookfornuis";
        this.props.adres = "";  
        this.props.aantal_fases_indien_meerfasig = "3";
        this.props.is_meerfasig = false;
        this.props.heeft_nul_indien_meerfasig = false;
    } 

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml();
        output += "Meerfasig: " + this.checkboxPropToHTML('is_meerfasig');

        if (this.props.is_meerfasig) {
            output += ", Aantal fasen: " + this.selectPropToHTML('aantal_fases_indien_meerfasig',["1","2","3"])
                   +  ", Met nul: " + this.checkboxPropToHTML('heeft_nul_indien_meerfasig');
        }

        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('kookfornuis');

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        var symbolX: number = 21;

        if (this.props.is_meerfasig) {
            mySVG.data += `<line x1="1" y1="25" x2="${symbolX+34}" y2="25" stroke="black" />`;

            switch (this.props.aantal_fases_indien_meerfasig) {
                case "1":
                    mySVG.data += '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />';
                    break;
                case "2":
                    mySVG.data += '<line x1="16.5" y1="35" x2="22.5" y2="15" stroke="black" />'
                               +  '<line x1="22.5" y1="35" x2="28.5" y2="15" stroke="black" />';
                    break;
                case "3":
                    mySVG.data += '<line x1="15" y1="35" x2="21" y2="15" stroke="black" />'
                               +  '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />'
                               +  '<line x1="27" y1="35" x2="33" y2="15" stroke="black" />';
                    break;
                default:
                    mySVG.data += '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />';
                    break;
            }

            if (this.props.heeft_nul_indien_meerfasig) {
                mySVG.data += '<line x1="39" y1="35" x2="45" y2="15" stroke="black" />'
                           +  '<circle cx="39" cy="35" r="2" fill="black" stroke="black" />';
            }

            symbolX += 34;
            mySVG.xright += 34;
        }

        mySVG.data += (sitplan || this.props.is_meerfasig ? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
                   +  '<use xlink:href="#kookfornuis" x="' + symbolX + '" y="25"></use>';
        
        mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,60,15));

        return(mySVG);
    }

}
