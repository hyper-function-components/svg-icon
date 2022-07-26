import props from "hfc-prop-names";

const svgAttrs: [string, string][] = process.env.SVG_ATTRS as any;
const svgHtml: string = process.env.SVG_HTML as string;

export default class AwesomeHfc {
  static tag = "svg";
  static props = props;
  constructor(public container: SVGElement, props: HfcProps) {
    for (let i = 0; i < svgAttrs.length; i++) {
      container.setAttribute(svgAttrs[i][0], svgAttrs[i][1]);
    }

    this.render(props);
    container.innerHTML = svgHtml;
  }
  changed(props: HfcProps) {
    this.render(props);
  }
  disconnected() {}
  render(props: HfcProps) {
    if (props.attrs.size) {
      this.container.setAttribute("width", props.attrs.size);
      this.container.setAttribute("height", props.attrs.size);
    }

    if (props.attrs.class) {
      this.container.setAttributeNS(null, "class", props.attrs.class);
    }

    bindToElement(this.container, props.others);
  }
}

function bindToElement(elem: SVGElement, obj: Record<string, any>) {
  for (let i = 0, keys = Object.keys(obj); i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];

    if (key === "style") {
      if (typeof value === "object") {
        Object.assign(elem.style, value);
      } else {
        elem.style.cssText += value;
      }

      continue;
    }

    if (typeof value === "function") {
      (elem as any)[key] = function (event: any) {
        value(event);
      };
    } else {
      elem.setAttribute(key, value);
    }
  }
}
