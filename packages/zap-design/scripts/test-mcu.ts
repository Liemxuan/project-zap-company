import { argbFromHex, SchemeTonalSpot, Hct } from "@material/material-color-utilities";

const argb = argbFromHex("#FF68A5");
const hct = Hct.fromInt(argb);
const scheme = new SchemeTonalSpot(hct, false, 0.0);

console.log("Surface Dim Tone:", Hct.fromInt(scheme.surfaceDim).tone);
console.log("Surface Tone:", Hct.fromInt(scheme.surface).tone);
console.log("Surface Bright Tone:", Hct.fromInt(scheme.surfaceBright).tone);
console.log("Surface Container Lowest Tone:", Hct.fromInt(scheme.surfaceContainerLowest).tone);
console.log("Surface Container Low Tone:", Hct.fromInt(scheme.surfaceContainerLow).tone);
console.log("Surface Container Tone:", Hct.fromInt(scheme.surfaceContainer).tone);
console.log("Surface Container High Tone:", Hct.fromInt(scheme.surfaceContainerHigh).tone);
console.log("Surface Container Highest Tone:", Hct.fromInt(scheme.surfaceContainerHighest).tone);
