import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

/**
 * Makes the element visible, then wiggles it slightly left and right, and leaves it straight at the end
 */
const wiggleAnimationStyle = keyframes([
  style({opacity: 0, transform: 'translateY(100%)', offset: 0}),
  style({opacity: 1, transform: 'translateY(0) rotate(-5deg)', offset: 0.1}),
  style({opacity: 1, transform: 'translateY(0) rotate(-5deg)', offset: 0.2}),
  style({opacity: 1, transform: 'translateY(0) rotate(5deg)', offset: 0.4}),
  style({opacity: 1, transform: 'translateY(0) rotate(-5deg)', offset: 0.6}),
  style({opacity: 1, transform: 'translateY(0) rotate(5deg)', offset: 0.8}),
  style({opacity: 1, transform: 'translateY(0) rotate(0deg)', offset: 1.0})
]);

export function wiggleAnimation(time: string) {
  return trigger('wiggle', [
    state('void', style({opacity: 0, transform: 'translateY(100%)'})),
    transition(':enter', [
      animate(time, wiggleAnimationStyle)
    ])
  ]);
}

export function fadeInAndOutAnimation(seconds: number) {
  return trigger('fadeIn', [
    transition(':enter', [
      style({opacity: 0}),
      animate(`${seconds / 1.5}s`, style({opacity: 0})),
      animate(`${seconds}s`, style({opacity: 1}))
    ]),
    transition(':leave', [
      style({opacity: 1}),
      animate(`${seconds / 9}s`, style({opacity: 1})),
      animate(`${seconds / 7}s`, style({opacity: 0})),
    ]),
  ]);
}