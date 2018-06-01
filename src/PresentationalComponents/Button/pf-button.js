// This is the Patternfly-3 version of buttons

import React from 'react';
import { Button } from 'patternfly-react';

class PF3Button extends React.Component {
  render () {  
    return (
      <div className="special-patternfly">
          <Button {...this.props}/>
      </div>
    );
  }
}

export default PF3Button;
