import * as sapper from '@sapper/app';

import '../../../../node_modules/materialize-css/dist/css/materialize.css';
//import '../static/global.css';
import '../../../../node_modules/materialize-css/dist/js/materialize';

sapper.start({
    target: document.querySelector('#sapper'),
});

M.AutoInit();
