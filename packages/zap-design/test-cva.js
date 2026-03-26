/* eslint-disable @typescript-eslint/no-require-imports */
const { cva } = require('class-variance-authority');
const buttonVariants = cva("base-class", {
  variants: {
    visualStyle: { solid: "solid-class", outline: "outline-class" },
    variant: { flat: "flat-class", soft: "soft-class" },
    color: { primary: "", secondary: "" }
  },
  compoundVariants: [
    { visualStyle: "solid", color: "primary", className: "bg-primary" },
    { visualStyle: "solid", color: "secondary", className: "bg-secondary" },
  ]
});
console.log(buttonVariants({ visualStyle: "solid", variant: "flat", color: "secondary" }));
