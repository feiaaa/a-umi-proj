import React from 'react';
import CheckboxTrigger from '@/components/CheckboxTrigger';

const Trigger:React.FC =()=>{

    return (<div>
            <h1>rc-trigger</h1>
            <CheckboxTrigger 
              action={['click']}
              data={Array.from(Array(36).keys())} 
              popAlign={{
                points: ['tl', 'bl'],
                offset: [0, 3]
              }}
            />
    </div>)

}
export default Trigger;