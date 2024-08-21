import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        {
          provide: ENVIRONMENT_INITIALIZER,
          useValue: () =>
            inject(MatIconRegistry).setDefaultFontSetClass(
              'material-icons-outlined'
            ),
          multi: true,
        },
      ],
    }),
  ],
};

export default preview;
