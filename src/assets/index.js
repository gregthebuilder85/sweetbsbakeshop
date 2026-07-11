import logo from "./logo.png";
import hero from "./hero.jpg";
import face from "./annalise-face.jpg";
import counter from "./annalise-counter.jpg";
import cakeHelloKitty from "./cake-hellokitty.jpg";
import cupcakesBloom from "./cupcakes-bloom.jpg";
import classPiping from "./class-piping.jpg";
import classGroup from "./class-group.jpg";

// Photo keys are stored on event rows; this maps them to bundled images.
export const PHOTOS = {
  "cupcakes-bloom": cupcakesBloom,
  "class-piping": classPiping,
  "class-group": classGroup,
  "cake-hellokitty": cakeHelloKitty,
  "annalise-counter": counter,
  hero,
};

export const PHOTO_OPTIONS = [
  { key: "cupcakes-bloom", label: "Bloom cupcakes" },
  { key: "class-piping", label: "Class — piping" },
  { key: "class-group", label: "Class — group" },
  { key: "cake-hellokitty", label: "Character cake" },
  { key: "annalise-counter", label: "At the counter" },
];

export { logo, hero, face, counter, cakeHelloKitty, cupcakesBloom, classPiping, classGroup };
