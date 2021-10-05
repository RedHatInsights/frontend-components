import React from "react";

import Battery from "./Battery";

export default {
  title: "Battery",
  component: Battery,
  decorators: [
    (Story) => (
      <div style={{ "margin-right": "100em"}}>
        <Story/>
      </div>
    ),
  ],
};

const Template = (args) => <Battery {...args} />;

export const BatteryLow = Template.bind({});

BatteryLow.args = {
  severity: "low",
  label: "Low battery",
  labelHidden: false,
};

export const BatteryMedium = Template.bind({});

BatteryMedium.args = {
  severity: "medium",
  label: "Medium battery",
  labelHidden: false,
};


export const BatteryHigh = Template.bind({});

BatteryHigh.args = {
  severity: "high",
  label: "High battery",
  labelHidden: false,
};


export const BatteryCritical = Template.bind({});

BatteryCritical.args = {
  severity: "critical",
  label: "Critical battery",
  labelHidden: false,
};

export const BatteryNull = Template.bind({});

BatteryNull.args = {
  severity: "",
  label: "Null battery",
  labelHidden: false,
};
