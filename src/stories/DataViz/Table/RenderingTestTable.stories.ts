//@ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import Table  from '@table/Table';
import { TABLE_DEFINTION as table } from '../../../../example/data/table_rendering_test'

const meta: Meta<typeof Table> = {
  title: 'NIAGADS-VIZ/Data Vizualization/Table/Rendering Test Table',
  component: Table,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
    args: {
       columns: table.columns,
       options: table.options,
       data: table.data
    }
};