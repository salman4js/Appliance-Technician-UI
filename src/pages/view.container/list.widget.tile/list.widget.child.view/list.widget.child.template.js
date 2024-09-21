import _ from 'lodash';

export default function listWidgetChildTemplate(options){
    if(options.subChildViewOptions && _.isArray(options.subChildViewOptions) && options.subChildViewOptions.length > 0){
        return options.subChildViewOptions.map((childViewOptions) => {
            if(options._id === childViewOptions._id){
                return(
                    <div>
                       <span className='list-widget-subChildView'>
                           {childViewOptions.key} : {childViewOptions.value}
                       </span>
                    </div>
                )
            }
        });
    }
}