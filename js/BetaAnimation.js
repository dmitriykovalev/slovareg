import TWEEN from 'tween.js';

function animate() {
  TWEEN.update();
  if (TWEEN.getAll().length > 0) {
    requestAnimationFrame(animate);
  }
}

export default function(beta, fromAngle, toAngle) {
  new TWEEN.Tween({angle: fromAngle})
    .delay(1000)
    .to({angle: toAngle}, 1500)
    .easing(TWEEN.Easing.Elastic.In)
    .onUpdate(function() {
      var transform = 'rotate(' + this.angle + 'deg)';
      beta.style.webkitTransform = transform;
      beta.style.transform = transform;
    })
    .start();

  animate();
}
