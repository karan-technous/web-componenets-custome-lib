export type Framework = 'angular' | 'react' | 'wc';

const FRAMEWORK_EVENT = 'framework-change';
let currentFramework: Framework = 'angular';

export function getFramework() {
  return currentFramework;
}

export function setFramework(framework: Framework) {
  currentFramework = framework;
  window.dispatchEvent(new CustomEvent<Framework>(FRAMEWORK_EVENT, { detail: framework }));
}

export function frameworkEventName() {
  return FRAMEWORK_EVENT;
}

