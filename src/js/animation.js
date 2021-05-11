import Snap from 'snapsvg'

const $face = Snap('#face');
const $mouse = Snap('#mouse');
$face.attr({ "translate": "transform(0,0)" });

export const svgAnimation = function () {
  Snap.animate(0, -150, function (val) {
    Snap('#face').transform(`translate(0,${val})`)
  }, 300, mina.easeout);
}
