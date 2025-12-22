import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import type { PageName } from '@/stores/useAppStore';

interface TourOptions {
  setPage: (page: PageName) => void;
}

export function createTour({ setPage }: TourOptions) {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'shepherd-theme-custom',
      scrollTo: { behavior: 'smooth', block: 'center' },
      cancelIcon: {
        enabled: true,
      },
      modalOverlayOpeningPadding: 8,
      modalOverlayOpeningRadius: 0,
      when: {
        show() {
          const currentStep = tour.currentStep;
          if (!currentStep) return;

          const stepIndex = tour.steps.indexOf(currentStep);
          const totalSteps = tour.steps.length;

          // Add progress indicator
          const footer = currentStep.el?.querySelector('.shepherd-footer');
          if (footer && !footer.querySelector('.shepherd-progress')) {
            const progress = document.createElement('div');
            progress.className = 'shepherd-progress';
            progress.textContent = `${stepIndex + 1} of ${totalSteps}`;
            footer.insertBefore(progress, footer.firstChild);
          }
        }
      }
    },
  });

  // Welcome step
  tour.addStep({
    id: 'welcome',
    title: 'Quick Guide',
    text: `
      <div class="space-y-2">
        <p>This is a quick walkthrough of how to use this app.</p>
        <ul class="list-disc space-y-1 text-sm">
          <li>Create currency exchange snapshots</li>
          <li>Visualize them as a graph</li>
          <li>Run algorithms to analyze the network</li>
        </ul>
      </div>
    `,
    buttons: [
      {
        text: 'Skip Tour',
        action: tour.cancel,
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Start Tour',
        action: () => {
          setPage('data');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(() => tour.next(), 100);
            });
          });
        },
      },
    ],
  });

  // Data page navigation button
  tour.addStep({
    id: 'data-nav',
    title: 'Step 1: Data',
    text: `
      <p>First, go to the Data page to create or load snapshots.</p>
    `,
    attachTo: {
      element: '[data-tour="data-nav"]',
      on: 'right'
    },
    beforeShowPromise: function() {
      return new Promise((resolve) => {
        setPage('data');
        // Wait for React to render the page
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 100);
          });
        });
      });
    },
    buttons: [
      {
        text: 'Back',
        action: tour.back,
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: tour.next,
      },
    ],
  });

  // Data page content
  tour.addStep({
    id: 'data-content',
    title: 'Create Snapshots',
    text: `
      <div class="space-y-2">
        <p>Use the buttons here to generate test data.</p>
        <ul class="list-disc space-y-1 text-sm">
          <li>Pick a scenario or generate random data</li>
          <li>Click "Load Latest" to view it in the graph</li>
        </ul>
      </div>
    `,
    attachTo: {
      element: '[data-tour="data-content"]',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        action: tour.back,
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: () => {
          setPage('graph');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(() => tour.next(), 100);
            });
          });
        },
      },
    ],
  });

  // Graph page navigation
  tour.addStep({
    id: 'graph-nav',
    title: 'Step 2: Graph',
    text: `
      <p>Now go to the Graph page to see the visualization and run algorithms.</p>
    `,
    attachTo: {
      element: '[data-tour="graph-nav"]',
      on: 'right'
    },
    beforeShowPromise: function() {
      return new Promise((resolve) => {
        setPage('graph');
        // Wait for React to render the page
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 100);
          });
        });
      });
    },
    buttons: [
      {
        text: 'Back',
        action: () => {
          setPage('data');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(() => tour.back(), 100);
            });
          });
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: tour.next,
      },
    ],
  });

  // Algorithms panel
  tour.addStep({
    id: 'algorithms',
    title: 'Run Algorithms',
    text: `
      <div class="space-y-2">
        <p>Click on any algorithm in the right panel to expand it and run.</p>
        <p class="text-xs mt-2">Results will be highlighted on the graph.</p>
      </div>
    `,
    buttons: [
      {
        text: 'Back',
        action: tour.back,
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: () => {
          setPage('learn');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(() => tour.next(), 100);
            });
          });
        },
      },
    ],
  });

  // Learn page
  tour.addStep({
    id: 'learn-page',
    title: 'Learn Page',
    text: `
      <p>Check the Learn page if you want to read more about how each algorithm works.</p>
    `,
    attachTo: {
      element: '[data-tour="learn-nav"]',
      on: 'right'
    },
    beforeShowPromise: function() {
      return new Promise((resolve) => {
        setPage('learn');
        // Wait for React to render the page
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 100);
          });
        });
      });
    },
    buttons: [
      {
        text: 'Back',
        action: () => {
          setPage('graph');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(() => tour.back(), 100);
            });
          });
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: tour.next,
      },
    ],
  });

  // Final step
  tour.addStep({
    id: 'complete',
    title: 'That\'s It',
    text: `
      <div class="space-y-2">
        <p><strong>Basic workflow:</strong></p>
        <ol class="list-decimal pl-4 space-y-1 text-sm">
          <li>Create a snapshot on Data page</li>
          <li>View it on Graph page</li>
          <li>Run algorithms to analyze it</li>
        </ol>
      </div>
    `,
    buttons: [
      {
        text: 'Back',
        action: tour.back,
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Finish Tour',
        action: () => {
          setPage('data');
          tour.complete();
        },
      },
    ],
  });

  return tour;
}
