import { Electro_Item } from "./Electro_Item";
import { htmlspecialchars, svgTextWidth, trimString } from "../general";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Klemmenstrook extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Klemmenstrook";
        this.props.adres = "";
    }

    allowedChilds() : Array<string> {
        return ["", "Kring"];
    }

    preferredChilds() : Array<string> {
        return ["", "Kring"];
    }

    getMaxNumChilds(): number {
        return 256;
    }

    getLeftColDisplayAdres() {
        return "";
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);
        if (mode !== "customElement") output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);
        return(output);
    }

    addInlineAddress(mySVG: SVGelement, starty: number, shiftx: number = 0) {
        const text = htmlspecialchars(this.props.adres ?? "");
        if (trimString(text) === "") return;

        const textX = mySVG.xleft + mySVG.xrightmin + 12 + shiftx;
        const textY = mySVG.yup + starty + 4;
        const textWidth = svgTextWidth(htmlspecialchars(text), 10, 'font-style="italic"');

        mySVG.data += `<text x="${textX}" y="${textY}" style="text-anchor:start; fill:black" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">${text}</text>`;
        mySVG.xright = Math.max(mySVG.xright, mySVG.xrightmin + 14 + textWidth + shiftx);
    }

    addTerminalStripSVG(mySVG: SVGelement, startx: number, spacings: number) {
        const startLineX = mySVG.xleft + startx;
        const endLineX = startLineX + mySVG.xrightmin;
        const centerX = (2 * mySVG.xleft + mySVG.xrightmin) / 2 + startx;
        const centerY = mySVG.yup + spacings + 0.5;
        const diagonalOffset = mySVG.xrightmin > 0 ? 10 : 5;

        mySVG.data += `<line x1="${startLineX}" x2="${endLineX}" y1="${mySVG.yup+.5}" y2="${mySVG.yup+.5}" stroke="black" />`;
        mySVG.data += `<line x1="${startLineX}" x2="${endLineX}" y1="${mySVG.yup+2*spacings+.5}" y2="${mySVG.yup+2*spacings+.5}" stroke="black" />`;
        mySVG.data += `<line x1="${centerX-diagonalOffset}" x2="${centerX+diagonalOffset}" y1="${centerY+diagonalOffset}" y2="${centerY-diagonalOffset}" stroke="black" />`;
        mySVG.data += `<use xlink:href="#leftcircle" x="${startLineX-5}" y="${mySVG.yup+spacings+.5}"></use>`;
        mySVG.data += `<use xlink:href="#rightcircle" x="${endLineX-5}" y="${mySVG.yup+spacings+.5}"></use>`;
    }

    toSVG() {
        SVGSymbols.addSymbol('leftcircle');
        SVGSymbols.addSymbol('rightcircle');

        // Eerst vragen we een tekening van alle kinderen
        let mySVG = this.sourcelist.toSVG(this.id, "horizontal");

        let parent = this.getParent();
        const spacings = 5;
        const offset = (2 * spacings + 1) / 2;

        if ((parent != null) && ((parent.getType() == "Aansluiting") || (parent.getType() == "Kring"))) {
            this.addTerminalStripSVG(mySVG, 0, spacings);
            this.addInlineAddress(mySVG, spacings);

            mySVG.ydown += offset;
            mySVG.yup += offset;

            if (this.isChildOf("Kring")) {
                const kringParent = this.getParent();
                if ((kringParent !== null) && (kringParent.getNumChilds() > 1)) {
                    mySVG.ydown += 11;
                    mySVG.data += `<line x1="${mySVG.xleft}" x2="${mySVG.xleft}" y1="${mySVG.yup+mySVG.ydown-11}" y2="${mySVG.yup+mySVG.ydown}" stroke="black" stroke-width="1" />`;
                }
            }
        } else {
            if (mySVG.xleft < 25) {
                mySVG.yup = 25;
                mySVG.ydown = 25;
                mySVG.xleft = 25;
                mySVG.xright = 25;
            }
            mySVG.xleft = mySVG.xleft - 25;
            mySVG.xright = mySVG.xright + mySVG.xleft + 2.5;
            if (mySVG.yup < 25) mySVG.yup = 25;
            if (mySVG.ydown < 25) mySVG.ydown = 25;

            this.addTerminalStripSVG(mySVG, 24, spacings);
            mySVG.data += `<line x1="1" x2="${mySVG.xleft+19}" y1="${mySVG.yup+5.5}" y2="${mySVG.yup+5.5}" stroke="black" />`;
            this.addInlineAddress(mySVG, spacings, 25);

            mySVG.ydown += offset;
            mySVG.yup += offset;
        }

        return(mySVG);
    }

}
